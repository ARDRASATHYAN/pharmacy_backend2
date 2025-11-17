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
const { updateStoreStock } = require('../services/stockService');

exports.createPurchaseReturn = async (req, res) => {
  const t = await PurchaseReturn.sequelize.transaction();

  try {
    const {
      purchase_id,
      store_id,
      created_by,
      return_date,
      reason,        // overall note
      items,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required.',
      });
    }

    // 1️⃣ Create purchase return header
    const purchaseReturn = await PurchaseReturn.create(
      {
        purchase_id,
        store_id,
        created_by,
        return_date: return_date || new Date(),
        reason,
        total_amount: 0, // will update after looping items
      },
      { transaction: t }
    );

    let totalAmount = 0;

    // 2️⃣ Loop through returned items
    for (const i of items) {
      const {
        item_id,
        batch_no,
        qty,
        rate,
        expiry_date,      // optional (if column exists)
        item_reason,      // optional per-item reason
      } = i;

      // Basic validation per item
      if (!item_id || !batch_no || !qty || !rate) {
        throw new Error('item_id, batch_no, qty and rate are required for each return item');
      }

      const amount = qty * rate;
      totalAmount += amount;

      // 3️⃣ Create purchase return item row
      await PurchaseReturnItem.create(
        {
          return_id: purchaseReturn.return_id,
          purchase_id,
          store_id,
          item_id,
          batch_no,
          qty,
          rate,
          amount,
          // only include these if your model has these fields:
          expiry_date: expiry_date || null,
          reason: item_reason || null,
        },
        { transaction: t }
      );

      // 4️⃣ Update store stock (❗stock OUT for purchase return)
      await updateStoreStock({
        transaction: t,
        store_id,
        item_id,
        batch_no,
        expiry_date: expiry_date || null,
        qty_change: -qty,    // negative → reduce stock
      });
    }

    // 5️⃣ Update total_amount in header
    await purchaseReturn.update(
      { total_amount: totalAmount },
      { transaction: t }
    );

    // ✅ Commit everything
    await t.commit();

    return res.status(201).json({
      success: true,
      return_id: purchaseReturn.return_id,
      total_amount: totalAmount,
    });
  } catch (err) {
    await t.rollback();
    console.error('Error creating purchase return:', err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
