// const { Sequelize } = require('sequelize');
// const PurchaseReturn = require('../models/PurchaseReturnModel');
// const PurchaseReturnItem = require('../models/PurchaseReturnItemModel');
// const StoreStock = require('../models/StoreStockModel');
// const Item = require('../models/ItemsModel');

// exports.createPurchaseReturn = async (req, res) => {
//   const t = await PurchaseReturn.sequelize.transaction();

//   try {
//     const { purchase_id, store_id, created_by, return_date, reason, items } = req.body;

//     if (!items || !items.length) {
//       return res.status(400).json({ success: false, message: 'Items array is required.' });
//     }

//     // 1️⃣ Create purchase return
//     const purchaseReturn = await PurchaseReturn.create({
//       purchase_id,
//       store_id,
//       created_by,
//       return_date: return_date || new Date(),
//       reason,
//       total_amount: 0, // will calculate later
//     }, { transaction: t });

//     let totalAmount = 0;

//     // 2️⃣ Loop through returned items
//     for (const i of items) {
//       const { item_id, batch_no, qty, rate } = i;

//       const amount = qty * rate;
//       totalAmount += amount;

//       // 3️⃣ Create purchase return item
//       await PurchaseReturnItem.create({
//         return_id: purchaseReturn.return_id,
//         item_id,
//         batch_no,
//         qty,
//         rate,
//         amount,
//       }, { transaction: t });

//       // 4️⃣ Update store stock (deduct returned qty)
//       const stock = await StoreStock.findOne({
//         where: {
//           store_id,
//           item_id,
//           batch_no,
//         },
//         transaction: t,
//       });

//       if (stock) {
//         await stock.update({
//           qty_in_stock: Sequelize.literal(`qty_in_stock - ${qty}`)
//         }, { transaction: t });
//       }
//     }

//     // 5️⃣ Update total_amount in purchase return
//     await purchaseReturn.update({ total_amount: totalAmount }, { transaction: t });

//     await t.commit();

//     return res.status(201).json({
//       success: true,
//       return_id: purchaseReturn.return_id,
//       total_amount: totalAmount,
//     });

//   } catch (err) {
//     await t.rollback();
//     console.error('Error creating purchase return:', err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };




// // const { Sequelize } = require('sequelize');
// // const PurchaseReturn = require('../models/PurchaseReturnModel');
// // const PurchaseReturnItem = require('../models/PurchaseReturnItemModel');
// // const StoreStock = require('../models/StoreStockModel');
// // const PurchaseInvoice = require('../models/PurchaseInvoicesModel');
// // const Item = require('../models/ItemsModel');

// // exports.createPurchaseReturn = async (req, res) => {
// //   const t = await PurchaseReturn.sequelize.transaction();

// //   try {
// //     const { purchase_id, store_id, created_by, return_date, reason, items } = req.body;

// //     if (!items || !items.length) {
// //       return res.status(400).json({ success: false, message: 'Items array is required.' });
// //     }

// //     // 1️⃣ Create purchase return
// //     const purchaseReturn = await PurchaseReturn.create({
// //       purchase_id,
// //       store_id,
// //       created_by,
// //       return_date: return_date || new Date(),
// //       reason,
// //       total_amount: 0, // will calculate later
// //     }, { transaction: t });

// //     let totalAmount = 0;

// //     // 2️⃣ Loop through returned items
// //     for (const i of items) {
// //       const { item_id, batch_no, qty, rate } = i;

// //       const amount = qty * rate;
// //       totalAmount += amount;

// //       // 3️⃣ Create purchase return item
// //       await PurchaseReturnItem.create({
// //         return_id: purchaseReturn.return_id,
// //         item_id,
// //         batch_no,
// //         qty,
// //         rate,
// //         amount,
// //       }, { transaction: t });

// //       // 4️⃣ Update store stock (deduct returned qty)
// //       const stock = await StoreStock.findOne({
// //         where: {
// //           store_id,
// //           item_id,
// //           batch_no,
// //         },
// //         transaction: t,
// //       });

// //       if (stock) {
// //         await stock.update({
// //           qty_in_stock: Sequelize.literal(`qty_in_stock - ${qty}`)
// //         }, { transaction: t });
// //       }
// //     }

// //     // 5️⃣ Update total amount in purchase return
// //     await purchaseReturn.update({ total_amount: totalAmount }, { transaction: t });

// //     await t.commit();

// //     return res.status(201).json({
// //       success: true,
// //       return_id: purchaseReturn.return_id,
// //       total_amount: totalAmount
// //     });

// //   } catch (err) {
// //     await t.rollback();
// //     console.error('Error creating purchase return:', err);
// //     return res.status(500).json({ success: false, message: err.message });
// //   }
// // };



const PurchaseReturn = require('../models/PurchaseReturnModel');
const PurchaseReturnItem = require('../models/PurchaseReturnItemModel');
const PurchaseItems = require('../models/PurchaseItemsModel');
const { updateStoreStock } = require('../services/stockService');

exports.createPurchaseReturn = async (req, res) => {
  const t = await PurchaseReturn.sequelize.transaction();

  try {
    const { purchase_id, store_id, created_by, return_date, reason, items } = req.body;

    if (!items?.length) {
      return res.status(400).json({ success: false, message: "Items array is required." });
    }

    // 1️⃣ Create return header
    const purchaseReturn = await PurchaseReturn.create(
      {
        purchase_id,
        store_id,
        created_by,
        return_date: return_date || new Date(),
        reason,
        total_amount: 0,
      },
      { transaction: t }
    );

    let totalAmount = 0;

    // 2️⃣ Loop items
    for (const i of items) {
      const { item_id, batch_no, qty, item_reason } = i;

      if (!item_id || !batch_no || !qty) {
        throw new Error("item_id, batch_no, qty are required.");
      }

      // 3️⃣ Fetch original purchase item row
      const purchaseItem = await PurchaseItems.findOne({
        where: { purchase_id, item_id, batch_no },
        transaction: t,
      });

      if (!purchaseItem) {
        throw new Error(`No purchase item found for item ${item_id}, batch ${batch_no}`);
      }

      const purchase_rate = purchaseItem.purchase_rate;
      const discount_percent = purchaseItem.discount_percent || 0;
      const gst_percent = purchaseItem.gst_percent || 0;

      // If pack-size logic → qty is already UNITS  
      // else: qty is units already

      // 4️⃣ Correct purchase-return calculation
      const baseAmount = qty * purchase_rate;

      const discountAmount = baseAmount * (discount_percent / 100);
      const baseAfterDiscount = baseAmount - discountAmount;

      const gstAmount = baseAfterDiscount * (gst_percent / 100);
      const totalItemAmount = baseAfterDiscount + gstAmount;

      totalAmount += totalItemAmount;

      // 5️⃣ Save purchase return item
      await PurchaseReturnItem.create(
        {
          return_id: purchaseReturn.return_id,
          purchase_id,
          store_id,
          item_id,
          batch_no,
          qty,
          rate: purchase_rate,            // ✔ original rate
          discount_percent,
          gst_percent,
          amount: totalItemAmount,        // ✔ final amount including GST
          reason: item_reason || null,
          expiry_date: purchaseItem.expiry_date,
        },
        { transaction: t }
      );

      // 6️⃣ Reduce stock (OUT)
      await updateStoreStock({
        transaction: t,
        store_id,
        item_id,
        batch_no,
        qty_change: -qty, // OUT
      });
    }

    // 7️⃣ Update total
    await purchaseReturn.update(
      { total_amount: totalAmount },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      return_id: purchaseReturn.return_id,
      total_amount: totalAmount,
    });

  } catch (err) {
    await t.rollback();
    console.error('Purchase Return Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPurchaseReturn= async (req, res) => {
  try {
    const data = await PurchaseReturn.findAll();
    res.json(data);
  } catch (error) {
    console.error('Error fetching purchase invoices:', error);
    res.status(500).json({ message: 'Error fetching purchase invoices' });
  }
};

exports.getPurchaseReturnItems = async (req, res) => {
  try {
    const data = await PurchaseReturnItem.findAll();
    res.json(data);
  } catch (error) {
    console.error("Error fetching purchase items:", error);
    res.status(500).json({ message: "Error fetching purchase items" });
  }
};



