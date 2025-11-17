const { Sequelize } = require('sequelize');
const PurchaseInvoice = require('../models/PurchaseInvoicesModel');
const PurchaseItems = require('../models/PurchaseItemsModel');
const StoreStock = require('../models/StoreStockModel');
const Item = require('../models/ItemsModel');
const { updateStoreStock } = require('../services/stockService'); // ✅ NEW

exports.createPurchase = async (req, res) => {
  const t = await PurchaseInvoice.sequelize.transaction();

  try {
    const { store_id, supplier_id, created_by, invoice_no, items } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Items array is required.' });
    }

    const invoiceNumber = invoice_no || `INV-${Date.now()}`;

    // 1️⃣ Create purchase invoice
    const invoice = await PurchaseInvoice.create(
      {
        store_id,
        supplier_id,
        created_by,
        invoice_no: invoiceNumber,
        invoice_date: new Date(),
        total_amount: 0,
        total_gst: 0,
        total_discount: 0,
        net_amount: 0,
      },
      { transaction: t }
    );

    let totalAmount = 0;
    let totalGst = 0;
    let totalDiscount = 0;

    // 2️⃣ Loop through items
    for (const i of items) {
      const {
        item_id,
        batch_no,
        expiry_date,
        qty,
        purchase_rate,
        mrp,
        discount_percent = 0,
      } = i;

      // Fetch item for HSN & GST
      const item = await Item.findByPk(item_id, { include: ['hsn'], transaction: t });
      if (!item) throw new Error(`Item ID ${item_id} not found`);

      const gstPercent = item.hsn?.gst_percent || 0;

      // Calculate totals
      const baseTotal = qty * purchase_rate;
      const discountAmount = baseTotal * (discount_percent / 100);
      const baseAfterDiscount = baseTotal - discountAmount;
      const gstAmount = baseAfterDiscount * (gstPercent / 100);
      const totalWithGst = baseAfterDiscount + gstAmount;

      totalAmount += baseAfterDiscount;
      totalGst += gstAmount;
      totalDiscount += discountAmount;

      // 3️⃣ Create purchase item row
      await PurchaseItems.create(
        {
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
        },
        { transaction: t }
      );

      // 4️⃣ Update store stock (centralized helper)
      await updateStoreStock({
        transaction: t,
        store_id,
        item_id,
        batch_no,
        expiry_date,
        qty_change: qty, // ✅ POSITIVE because purchase adds stock
        purchase_rate,
        mrp,
        gst_percent: gstPercent,
      });
    }

    // 5️⃣ Update invoice totals
    await invoice.update(
      {
        total_amount: totalAmount,
        total_gst: totalGst,
        total_discount: totalDiscount,
        net_amount: totalAmount + totalGst,
      },
      { transaction: t }
    );

    await t.commit();

    return res
      .status(201)
      .json({ success: true, invoice_id: invoice.purchase_id });
  } catch (error) {
    await t.rollback();
    console.error('Error creating purchase:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPurchaseInvoice = async (req, res) => {
  try {
    const data = await PurchaseInvoice.findAll();
    res.json(data);
  } catch (error) {
    console.error('Error fetching purchase invoices:', error);
    res.status(500).json({ message: 'Error fetching purchase invoices' });
  }
};

exports.getPurchaseItems = async (req, res) => {
  try {
    const data = await PurchaseItems.findAll();
    res.json(data);
  } catch (error) {
    console.error('Error fetching purchase items:', error);
    res.status(500).json({ message: 'Error fetching purchase items' });
  }
};
