// services/stockService.js
const { Sequelize } = require('sequelize');
const StoreStock = require('../models/StoreStockModel');

function computeSalesRate(mrp, discount_percent = 0) {
  mrp = Number(mrp);
  discount_percent = Number(discount_percent);
  if (!mrp) return null;
  return parseFloat((mrp - (mrp * (discount_percent / 100))).toFixed(2));
}

// Round helper to 2 decimals
const round2 = (num) => Number(Number(num).toFixed(2));

async function updateStoreStock({
  transaction,
  store_id,
  item_id,
  batch_no,
  expiry_date = null,
  qty_change,
  purchase_rate = null,
  mrp = null,
  gst_percent = null,
  discount_percent = 0,
}) {
  const sale_rate = computeSalesRate(mrp, discount_percent);
  const qtyChangeNum = Number(qty_change);

  if (!qtyChangeNum || isNaN(qtyChangeNum)) {
    throw new Error("qty_change must be a valid number");
  }

  // 🔹 STOCK IN (purchase, sales return, excess stock etc.)
  if (qtyChangeNum > 0) {
    const existingStock = await StoreStock.findOne({
      where: { store_id, item_id, batch_no },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (existingStock) {
      const currentQty = Number(existingStock.qty_in_stock) || 0;
      const newQty = round2(currentQty + qtyChangeNum);

      await existingStock.update(
        {
          qty_in_stock: newQty,
          purchase_rate: purchase_rate ?? existingStock.purchase_rate,
          mrp: mrp ?? existingStock.mrp,
          gst_percent: gst_percent ?? existingStock.gst_percent,
          expiry_date: expiry_date ?? existingStock.expiry_date,
          sale_rate: sale_rate ?? existingStock.sale_rate,
        },
        { transaction }
      );
    } else {
      await StoreStock.create(
        {
          store_id,
          item_id,
          batch_no,
          expiry_date,
          qty_in_stock: round2(qtyChangeNum),
          purchase_rate,
          mrp,
          gst_percent,
          sale_rate,
        },
        { transaction }
      );
    }
    return;
  }

  // 🔹 STOCK OUT (sales, purchase return, damaged stock etc.)
  if (qtyChangeNum < 0) {
    const qtyOut = Math.abs(qtyChangeNum);

    const existingStock = await StoreStock.findOne({
      where: { store_id, item_id, batch_no },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    const currentQty = existingStock ? Number(existingStock.qty_in_stock) : 0;

    if (!existingStock || currentQty < qtyOut) {
      throw new Error(
        `Insufficient stock for item ${item_id}, batch ${batch_no} in store ${store_id}`
      );
    }

    const newQty = round2(currentQty - qtyOut);

    await existingStock.update({ qty_in_stock: newQty }, { transaction });
  }
}

module.exports = { updateStoreStock };

// services/stockService.js
// const { Sequelize } = require('sequelize');
// const StoreStock = require('../models/StoreStockModel');

// function computeSalesRate(mrp, discount_percent = 0) {
//   mrp = Number(mrp);
//   discount_percent = Number(discount_percent);
//   if (!mrp) return null;
//   return parseFloat((mrp - (mrp * (discount_percent / 100))).toFixed(2));
// }


// /**
//  * Update stock in store
//  * qty_change: +ve for IN, -ve for OUT
//  */
// async function updateStoreStock({
//   transaction,
//   store_id,
//   item_id,
//   batch_no,
//   expiry_date = null,
//   qty_change,           
//   purchase_rate = null,
//   mrp = null,
//   gst_percent = null,
//   discount_percent = 0,
// }) {
//   const sale_rate = computeSalesRate(mrp, discount_percent);

//   // Round helper to 2 decimals
//   const round = (num) => Math.round(num * 100) / 100;

//   // Stock IN (purchase, sale return)
//   if (qty_change > 0) {
//     const existingStock = await StoreStock.findOne({
//       where: { store_id, item_id, batch_no },
//       transaction,
//       lock: transaction.LOCK.UPDATE,
//     });

//     if (existingStock) {
//    const newQty = round(Number(existingStock.qty_in_stock) + Number(qty_change));

//       await existingStock.update(
//         {
//           qty_in_stock: newQty,
//           purchase_rate: purchase_rate ?? existingStock.purchase_rate,
//           mrp: mrp ?? existingStock.mrp,
//           gst_percent: gst_percent ?? existingStock.gst_percent,
//           expiry_date: expiry_date ?? existingStock.expiry_date,
//           sale_rate: sale_rate ?? existingStock.sale_rate,
//         },
//         { transaction }
//       );
//     } else {
//       await StoreStock.create(
//         {
//           store_id,
//           item_id,
//           batch_no,
//           expiry_date,
//           qty_in_stock: round(qty_change),
//           purchase_rate,
//           mrp,
//           gst_percent,
//           sale_rate,
//         },
//         { transaction }
//       );
//     }
//     return;
//   }

//   // Stock OUT (sale, purchase return)
//   if (qty_change < 0) {
//     const qtyOut = Math.abs(qty_change);
//     const existingStock = await StoreStock.findOne({
//       where: { store_id, item_id, batch_no },
//       transaction,
//       lock: transaction.LOCK.UPDATE,
//     });

//     if (!existingStock || existingStock.qty_in_stock < qtyOut) {
//       throw new Error(
//         `Insufficient stock for item ${item_id}, batch ${batch_no} in store ${store_id}`
//       );
//     }

// const newQty = round(Number(existingStock.qty_in_stock) - Number(qtyOut));

//     await existingStock.update({ qty_in_stock: newQty }, { transaction });
//   }
// }

// module.exports = { updateStoreStock };





// const { Sequelize } = require('sequelize');
// const StoreStock = require('../models/StoreStockModel');

// function computeSalesRate(mrp, discount_percent = 0) {
//   if (!mrp) return null;
//   return mrp - (mrp * (discount_percent / 100));
// }



// async function updateStoreStock({
//   transaction,
//   store_id,
//   item_id,
//   batch_no,
//   expiry_date = null,
//   qty_change,           // +ve for IN, -ve for OUT
//   purchase_rate = null,
//   mrp = null,
//   gst_percent = null,
//    discount_percent = 0, 
// }) {

//   const sale_rate = computeSalesRate(mrp, discount_percent);

//   // Stock IN (purchase, sale return)
//   if (qty_change > 0) {
//     const existingStock = await StoreStock.findOne({
//       where: { store_id, item_id, batch_no },
//       transaction,
//       lock: transaction.LOCK.UPDATE, // optional: for high concurrency
//     });

//     if (existingStock) {
//       await existingStock.update(
//         {
//           qty_in_stock: existingStock.qty_in_stock + qty_change,
//           // optional: update latest rates & expiry info
//           purchase_rate: purchase_rate ?? existingStock.purchase_rate,
//           mrp: mrp ?? existingStock.mrp,
//           gst_percent: gst_percent ?? existingStock.gst_percent,
//           expiry_date: expiry_date ?? existingStock.expiry_date,

//           sale_rate: sale_rate ?? existingStock.sale_rate
//         },
//         { transaction }
//       );
//     } else {
//       await StoreStock.create(
//         {
//           store_id,
//           item_id,
//           batch_no,
//           expiry_date,
//           qty_in_stock: qty_change,
//           purchase_rate,
//           mrp,
//           gst_percent,
//            sale_rate
//         },
//         { transaction }
//       );
//     }
//     return;
//   }

//   // Stock OUT (sale, purchase return)
//   if (qty_change < 0) {
//     const qtyOut = Math.abs(qty_change);

//     const existingStock = await StoreStock.findOne({
//       where: { store_id, item_id, batch_no },
//       transaction,
//       lock: transaction.LOCK.UPDATE,
//     });

//     if (!existingStock || existingStock.qty_in_stock < qtyOut) {
//       throw new Error(
//         `Insufficient stock for item ${item_id}, batch ${batch_no} in store ${store_id}`
//       );
//     }

//     await existingStock.update(
//       {
//         qty_in_stock: existingStock.qty_in_stock - qtyOut,
//       },
//       { transaction }
//     );
//   }
// }

// module.exports = { updateStoreStock };
