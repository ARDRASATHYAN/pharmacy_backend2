// controllers/SalesReturnController.js
const sequelize = require("../config/db");
const SalesReturn = require("../models/SalesReturnModel");
const SalesReturnItem = require("../models/SalesReturnItemsModel");
const StoreStock = require("../models/StoreStockModel");
const { updateStoreStock } = require("../services/stockService");

// exports.createSalesReturn = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const {
//       sale_id,           // optional: link to original sale
//       store_id,
//       return_date,
//       reason,
//       total_amount,
//       created_by,
//       items = [],
//     } = req.body;

//     if (!store_id) {
//       await t.rollback();
//       return res.status(400).json({ message: "store_id is required" });
//     }
//     if (!items.length) {
//       await t.rollback();
//       return res.status(400).json({ message: "At least one return item is required" });
//     }

//     // 1️⃣ Create sales_return header
//     const salesReturn = await SalesReturn.create(
//       {
//         sale_id: sale_id || null,
//         store_id,
//         return_date,
//         reason,
//         total_amount,
//         created_by,
//       },
//       { transaction: t }
//     );

//     // 2️⃣ For each item: create return item + stock IN
//     for (const row of items) {
//       const { item_id, batch_no, qty, rate, amount } = row;

//       if (!item_id || !qty) {
//         await t.rollback();
//         return res
//           .status(400)
//           .json({ message: "Each return item must have item_id and qty" });
//       }

//       // Get stock info (for expiry, mrp, gst, etc if needed)
//       const stockRow = await StoreStock.findOne({
//         where: { store_id, item_id, batch_no },
//         transaction: t,
//         lock: t.LOCK.UPDATE,
//       });

//       // 2.a) Create row in sales_return_items
//       await SalesReturnItem.create(
//         {
//           return_id: salesReturn.return_id,
//           item_id,
//           batch_no,
//           qty,
//           rate,
//           amount,
//         },
//         { transaction: t }
//       );

//       // 2.b) Stock IN (reverse of sale)
//       await updateStoreStock({
//         transaction: t,
//         store_id,
//         item_id,
//         batch_no,
//         expiry_date: stockRow ? stockRow.expiry_date : null,
//         qty_change: qty,                     // POSITIVE = IN
//         purchase_rate: stockRow ? stockRow.purchase_rate : null,
//         mrp: stockRow ? stockRow.mrp : null,
//         gst_percent: stockRow ? stockRow.gst_percent : null,
//         discount_percent: 0,                         // normally not needed on return
//       });
//     }

//     await t.commit();
//     return res.status(201).json({
//       message: "Sales return created successfully",
//       data: salesReturn,
//     });
//   } catch (err) {
//     console.error("Error creating sales return:", err);
//     await t.rollback();
//     return res
//       .status(500)
//       .json({ message: err.message || "Error creating sales return" });
//   }
// };

// (Optional) get list


exports.createSalesReturn = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      sale_id,
      store_id,
      return_date,
      reason,
      total_amount,
      created_by,
      items = [],
    } = req.body;

    if (!store_id) {
      await t.rollback();
      return res.status(400).json({ message: "store_id is required" });
    }

    if (!items.length) {
      await t.rollback();
      return res.status(400).json({ message: "At least one return item is required" });
    }

    // 1️⃣ Create sales_return header
    const salesReturn = await SalesReturn.create(
      {
        sale_id: sale_id || null,
        store_id,
        return_date,
        reason,
        total_amount,
        created_by,
      },
      { transaction: t }
    );

    // 2️⃣ Process each item
    for (const row of items) {
      const { item_id, batch_no, qty, rate, amount } = row;

      if (!item_id || !qty) {
        await t.rollback();
        return res.status(400).json({ message: "Each return item must have item_id and qty" });
      }

      // 2.a) Create return item
      await SalesReturnItem.create(
        {
          return_id: salesReturn.return_id,
          item_id,
          batch_no,
          qty: Number(qty),
          rate: Number(rate),
          amount: Number(amount),
        },
        { transaction: t }
      );

      // 2.b) Increase stock
      await updateStoreStock({
        transaction: t,
        store_id,
        item_id,
        batch_no,
        qty_change: Number(qty), // +ve = IN
      });
    }

    await t.commit();
    return res.status(201).json({
      message: "Sales return created successfully",
      data: salesReturn,
    });
  } catch (err) {
    console.error("Error creating sales return:", err);
    await t.rollback();
    return res.status(500).json({ message: err.message || "Error creating sales return" });
  }
};

exports.getSalesReturns = async (req, res) => {
  try {
    const data = await SalesReturn.findAll({
      include: [
        { association: "store" },
        { association: "sale" },
        { association: "creator" },
      ],
    });
    res.json(data);
  } catch (err) {
    console.error("Error fetching sales returns:", err);
    res.status(500).json({ message: "Error fetching sales returns" });
  }
};


exports.getSalesReturnsItems = async (req, res) => {
  try {
    const data = await SalesReturnItem.findAll();
    res.json(data);
  } catch (err) {
    console.error("Error fetching sales returns:", err);
    res.status(500).json({ message: "Error fetching sales returns" });
  }
};
