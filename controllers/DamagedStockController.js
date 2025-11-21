const sequelize = require("../config/db");
const DamagedStock = require("../models/DamagedStockModel");
const { updateStoreStock } = require("../services/stockService");

exports.createDamagedStock = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { store_id, entry_date, created_by, items = [] } = req.body;

    if (!store_id) {
      await t.rollback();
      return res.status(400).json({ message: "store_id is required" });
    }

    if (!created_by) {
      await t.rollback();
      return res.status(400).json({ message: "created_by is required" });
    }

    if (!items.length) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "At least one damaged item is required" });
    }

    const entryDate = entry_date || new Date();
    const createdRows = [];

    for (const row of items) {
      const { item_id, batch_no, qty, reason } = row;

      if (!item_id || !batch_no || !qty) {
        await t.rollback();
        return res.status(400).json({
          message: "Each item must have item_id, batch_no and qty",
        });
      }

      const qtyNum = Number(qty);
      if (isNaN(qtyNum) || qtyNum <= 0) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: "qty must be a positive number" });
      }

      // 1) Insert into damaged_stock
      const damaged = await DamagedStock.create(
        {
          store_id,
          item_id,
          batch_no,
          qty: qtyNum,
          reason: reason || null,
          entry_date: entryDate,
          created_by,
        },
        { transaction: t }
      );

      createdRows.push(damaged);

      // 2) Decrease stock
      await updateStoreStock({
        transaction: t,
        store_id,
        item_id,
        batch_no,
        qty_change: -qtyNum,
      });
    }

    await t.commit();

    return res.status(201).json({
      message: "Damaged stock recorded and stock decreased successfully",
      data: createdRows,
    });
  } catch (err) {
    console.error("Error creating damaged stock:", err);
    await t.rollback();
    return res
      .status(500)
      .json({ message: err.message || "Error creating damaged stock" });
  }
};

exports.getDamagedStock = async (req, res) => {
  try {
    const data = await DamagedStock.findAll({
      include: [
        { association: "store" },
        { association: "item" },
        { association: "user" },
      ],
      order: [["damaged_id", "DESC"]],
    });

    res.json(data);
  } catch (err) {
    console.error("Error fetching damaged stock:", err);
    res.status(500).json({ message: "Error fetching damaged stock" });
  }
};
