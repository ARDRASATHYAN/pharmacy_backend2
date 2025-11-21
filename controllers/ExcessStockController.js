const sequelize = require("../config/db");
const ExcessStock = require("../models/ExcessStockModel");
const { updateStoreStock } = require("../services/stockService");


exports.createExcessStock = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { store_id, entry_date, created_by, items = [] } = req.body;

    // 🔹 Basic validations
    if (!store_id) {
      await t.rollback();
      return res.status(400).json({ message: "store_id is required" });
    }

    if (!created_by) {
      await t.rollback();
      return res.status(400).json({ message: "created_by is required" });
    }

    if (!Array.isArray(items) || !items.length) {
      await t.rollback();
      return res.status(400).json({
        message: "At least one excess item is required",
      });
    }

    // 🔹 Loop all items and insert + update stock
    for (const row of items) {
      const { item_id, batch_no, qty, reason } = row;

      if (!item_id || !batch_no || !qty) {
        await t.rollback();
        return res.status(400).json({
          message:
            "Each excess item must have item_id, batch_no and qty",
        });
      }

      const qtyNum = Number(qty);
      if (isNaN(qtyNum) || qtyNum <= 0) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: "qty must be a positive number" });
      }

      // 1️⃣ Insert into excess_stock
      await ExcessStock.create(
        {
          store_id,
          item_id,
          batch_no,
          qty: qtyNum,
          reason: reason || null,
          entry_date: entry_date || new Date(),
          created_by,
        },
        { transaction: t }
      );

      // 2️⃣ Increase stock (IN)
      await updateStoreStock({
        transaction: t,
        store_id,
        item_id,
        batch_no,
        qty_change: qtyNum, // positive = IN
      });
    }

    await t.commit();
    return res.status(201).json({
      message: "Excess stock recorded and stock increased successfully",
    });
  } catch (err) {
    console.error("Error creating excess stock:", err);
    await t.rollback();
    return res
      .status(500)
      .json({ message: err.message || "Error creating excess stock" });
  }
};

exports.getExcessStock = async (req, res) => {
  try {
    const data = await ExcessStock.findAll({
      include: [
        { association: "store" },
        { association: "item" },
        { association: "user" },
      ],
      order: [["excess_id", "DESC"]],
    });

    res.json(data);
  } catch (err) {
    console.error("Error fetching excess stock:", err);
    res.status(500).json({ message: "Error fetching excess stock" });
  }
};


exports.getExcessStock = async (req, res) => {
  try {
    const data = await ExcessStock.findAll({
      include: [
        { association: "store" },
        { association: "item" },
        { association: "user" },
      
    ],
      order: [["excess_id", "DESC"]],
    });

    res.json(data);
  } catch (err) {
    console.error("Error fetching excess stock:", err);
    res.status(500).json({ message: "Error fetching excess stock" });
  }
};
