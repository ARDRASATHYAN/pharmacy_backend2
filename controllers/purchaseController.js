const { Sequelize } = require('sequelize');
const PurchaseInvoice = require('../models/PurchaseInvoicesModel');
const PurchaseItems = require('../models/PurchaseItemsModel');
const StoreStock = require('../models/StoreStockModel');
const Item = require('../models/ItemsModel');

exports.createPurchase = async (req, res) => {
  const t = await PurchaseInvoice.sequelize.transaction();

  try {
    const { store_id, supplier_id, created_by, invoice_no, items } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Items array is required.' });
    }

    // Generate invoice number if not provided
    const invoiceNumber = invoice_no || `INV-${Date.now()}`;

    // 1️⃣ Create purchase invoice
    const invoice = await PurchaseInvoice.create({
      store_id,
      supplier_id,
      created_by,
      invoice_no: invoiceNumber,
      invoice_date: new Date(),
      total_amount: 0,
      total_gst: 0,
      total_discount: 0,
      net_amount: 0,
    }, { transaction: t });

    let totalAmount = 0;
    let totalGst = 0;
    let totalDiscount = 0;

    // 2️⃣ Loop through items
    for (const i of items) {
      const { item_id, batch_no, expiry_date, qty, purchase_rate, mrp, discount_percent = 0 } = i;

      // Fetch item for HSN & GST
      const item = await Item.findByPk(item_id, { include: ['hsn'] });
      if (!item) throw new Error(`Item ID ${item_id} not found`);

      const gstPercent = item.hsn?.gst_percent || 0;

      // Calculate totals
      const baseTotal = qty * purchase_rate;
      const discountAmount = baseTotal * (discount_percent / 100);
      const gstAmount = (baseTotal - discountAmount) * (gstPercent / 100);
      const totalWithGst = baseTotal - discountAmount + gstAmount;

      // Accumulate totals for invoice
      totalAmount += baseTotal - discountAmount;
      totalGst += gstAmount;
      totalDiscount += discountAmount;

      // 3️⃣ Create purchase item
      await PurchaseItems.create({
        purchase_id: invoice.purchase_id,
        item_id,
        batch_no,
        expiry_date,
        qty,
        purchase_rate,
        mrp,
        gst_percent: gstPercent,
        discount_percent,
        total_amount: totalWithGst,
      }, { transaction: t });

      // 4️⃣ Update or insert store stock
      const existingStock = await StoreStock.findOne({
        where: { store_id, item_id, batch_no },
        transaction: t,
      });

      if (existingStock) {
        await existingStock.update({
          qty_in_stock: Sequelize.literal(`qty_in_stock + ${qty}`),
          purchase_rate,
          mrp,
          gst_percent: gstPercent,
        }, { transaction: t });
      } else {
        await StoreStock.create({
          store_id,
          item_id,
          batch_no,
          expiry_date,
          qty_in_stock: qty,
          purchase_rate,
          mrp,
          gst_percent: gstPercent,
        }, { transaction: t });
      }
    }

    // 5️⃣ Update invoice totals
    await invoice.update({
      total_amount: totalAmount,
      total_gst: totalGst,
      total_discount: totalDiscount,
      net_amount: totalAmount + totalGst,
    }, { transaction: t });

    // Commit transaction
    await t.commit();

    return res.status(201).json({ success: true, invoice_id: invoice.purchase_id });

  } catch (error) {
    await t.rollback();
    console.error('Error creating purchase:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
