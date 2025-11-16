const { Sequelize } = require('sequelize');
const PurchaseReturn = require('../models/PurchaseReturnModel');
const PurchaseReturnItem = require('../models/PurchaseReturnItemModel');
const StoreStock = require('../models/StoreStockModel');
const Item = require('../models/ItemsModel');

exports.createPurchaseReturn = async (req, res) => {
  const t = await PurchaseReturn.sequelize.transaction();

  try {
    const { purchase_id, store_id, created_by, return_date, reason, items } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Items array is required.' });
    }

    // 1️⃣ Create purchase return
    const purchaseReturn = await PurchaseReturn.create({
      purchase_id,
      store_id,
      created_by,
      return_date: return_date || new Date(),
      reason,
      total_amount: 0, // will calculate later
    }, { transaction: t });

    let totalAmount = 0;

    // 2️⃣ Loop through returned items
    for (const i of items) {
      const { item_id, batch_no, qty, rate } = i;

      const amount = qty * rate;
      totalAmount += amount;

      // 3️⃣ Create purchase return item
      await PurchaseReturnItem.create({
        return_id: purchaseReturn.return_id,
        item_id,
        batch_no,
        qty,
        rate,
        amount,
      }, { transaction: t });

      // 4️⃣ Update store stock (deduct returned qty)
      const stock = await StoreStock.findOne({
        where: {
          store_id,
          item_id,
          batch_no,
        },
        transaction: t,
      });

      if (stock) {
        await stock.update({
          qty_in_stock: Sequelize.literal(`qty_in_stock - ${qty}`)
        }, { transaction: t });
      }
    }

    // 5️⃣ Update total_amount in purchase return
    await purchaseReturn.update({ total_amount: totalAmount }, { transaction: t });

    await t.commit();

    return res.status(201).json({
      success: true,
      return_id: purchaseReturn.return_id,
      total_amount: totalAmount,
    });

  } catch (err) {
    await t.rollback();
    console.error('Error creating purchase return:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};




// const { Sequelize } = require('sequelize');
// const PurchaseReturn = require('../models/PurchaseReturnModel');
// const PurchaseReturnItem = require('../models/PurchaseReturnItemModel');
// const StoreStock = require('../models/StoreStockModel');
// const PurchaseInvoice = require('../models/PurchaseInvoicesModel');
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

//     // 5️⃣ Update total amount in purchase return
//     await purchaseReturn.update({ total_amount: totalAmount }, { transaction: t });

//     await t.commit();

//     return res.status(201).json({
//       success: true,
//       return_id: purchaseReturn.return_id,
//       total_amount: totalAmount
//     });

//   } catch (err) {
//     await t.rollback();
//     console.error('Error creating purchase return:', err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };
