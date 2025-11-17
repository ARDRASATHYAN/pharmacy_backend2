// services/stockService.js
const { Sequelize } = require('sequelize');
const StoreStock = require('../models/StoreStockModel');

async function updateStoreStock({
  transaction,
  store_id,
  item_id,
  batch_no,
  expiry_date = null,
  qty_change,           // +ve for IN, -ve for OUT
  purchase_rate = null,
  mrp = null,
  gst_percent = null,
}) {
  // Stock IN (purchase, sale return)
  if (qty_change > 0) {
    const existingStock = await StoreStock.findOne({
      where: { store_id, item_id, batch_no },
      transaction,
      lock: transaction.LOCK.UPDATE, // optional: for high concurrency
    });

    if (existingStock) {
      await existingStock.update(
        {
          qty_in_stock: existingStock.qty_in_stock + qty_change,
          // optional: update latest rates & expiry info
          purchase_rate: purchase_rate ?? existingStock.purchase_rate,
          mrp: mrp ?? existingStock.mrp,
          gst_percent: gst_percent ?? existingStock.gst_percent,
          expiry_date: expiry_date ?? existingStock.expiry_date,
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
          qty_in_stock: qty_change,
          purchase_rate,
          mrp,
          gst_percent,
        },
        { transaction }
      );
    }
    return;
  }

  // Stock OUT (sale, purchase return)
  if (qty_change < 0) {
    const qtyOut = Math.abs(qty_change);

    const existingStock = await StoreStock.findOne({
      where: { store_id, item_id, batch_no },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!existingStock || existingStock.qty_in_stock < qtyOut) {
      throw new Error(
        `Insufficient stock for item ${item_id}, batch ${batch_no} in store ${store_id}`
      );
    }

    await existingStock.update(
      {
        qty_in_stock: existingStock.qty_in_stock - qtyOut,
      },
      { transaction }
    );
  }
}

module.exports = { updateStoreStock };
