
const sequelize = require("../config/db");
const { Transaction } = require("sequelize");

const SalesInvoices = require("../models/SalesInvoicesModel");
const Customer = require("../models/CustomerModel");
const StoreStock = require("../models/StoreStockModel");
const { updateStoreStock } = require("../services/stockService");
const Item = require("../models/ItemsModel");
const SalesItems = require("../models/SalesItemsModel");

// helper: resolve / create customer inside SAME transaction
async function resolveCustomer({ customer_id, customer, transaction }) {
  if (customer_id) return customer_id;
  if (!customer) return null;

  const { customer_name, phone } = customer;
  if (!customer_name && !phone) return null;

  // try to find existing by phone
  if (phone) {
    const existing = await Customer.findOne({
      where: { phone },
      transaction,
    });
    if (existing) return existing.customer_id;
  }

  // create new
  const newCustomer = await Customer.create(
    {
      customer_name: customer_name || "Walk-in Customer",
      phone: phone || null,
    },
    { transaction }
  );

  return newCustomer.customer_id;
}

// ✅ Create sale
exports.createSale = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      store_id,
      created_by,
      bill_no,
      bill_date,
      doctor_name,
      prescription_no,
      total_amount,
      total_gst,
      total_discount,
      net_amount,
      customer_id,
      customer,   // { customer_name, phone } from frontend
      items,
    } = req.body;

    if (!store_id) {
      throw new Error("store_id is required");
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("At least one sale item is required");
    }

    // 1️⃣ Customer handling (with transaction)
    const finalCustomerId = await resolveCustomer({
      customer_id,
      customer,
      transaction: t,
    });

    // 2️⃣ Create invoice header
    const saleInvoice = await SalesInvoices.create(
      {
        store_id,
        customer_id: finalCustomerId,
        bill_no,
        bill_date,
        doctor_name,
        prescription_no,
        total_amount,
        total_gst,
        total_discount,
        net_amount,
        created_by,
      },
      { transaction: t }
    );

    const sale_id = saleInvoice.sale_id;

    // 3️⃣ Create items + reduce stock
    for (const row of items) {
      const {
        item_id,
        batch_no,
        qty,
        rate,
        gst_percent,
        discount_percent,
        total_amount: line_total,
      } = row;

      if (!item_id || !batch_no || !qty) {
        throw new Error("item_id, batch_no and qty are required on each row");
      }

      // ⛽ check available stock first
      const existingStock = await StoreStock.findOne({
        where: {
          store_id,
          item_id,
          batch_no,
        },
        transaction: t,
        // if you REALLY want lock:
        // lock: Transaction.LOCK.UPDATE,
      });

      if (!existingStock || Number(existingStock.qty_in_stock) < Number(qty)) {
        throw new Error(
          `Insufficient stock for item ${item_id}, batch ${batch_no} in store ${store_id}`
        );
      }

      // 🧾 create sales item
      await SalesItems.create(
        {
          sale_id,
          item_id,
          batch_no,
          qty,
          rate,
          gst_percent,
          discount_percent,
          total_amount: line_total,
        },
        { transaction: t }
      );

      // 📉 reduce stock using your stockService
      await updateStoreStock({
        transaction: t,
        store_id,
        item_id,
        batch_no,
        expiry_date: existingStock.expiry_date,
        qty_change: -Number(qty), // OUT
        purchase_rate: existingStock.purchase_rate,
        mrp: existingStock.mrp,
        gst_percent: existingStock.gst_percent,
        discount_percent: discount_percent || 0,
      });
    }

    await t.commit();
    return res.status(201).json({
      message: "Sale invoice created successfully",
      data: saleInvoice,
    });
  } catch (err) {
    console.error("Error creating sale:", err);
    await t.rollback();
    return res
      .status(500)
      .json({ message: err.message || "Error creating sale" });
  }
};


// (Optional) List sales
exports.getAllSales = async (req, res) => {
  try {
    const data = await SalesInvoices.findAll({
      include: [
        { association: "store" },
        { association: "customer" },
        { association: "creater" },
      ],
      order: [["sale_id", "DESC"]],
    });
    res.json(data);
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).json({ message: "Error fetching sales" });
  }
};

exports.getAllSalesItems = async (req, res) => {
  try {
    const data = await SalesItems.findAll({
       // or updated_at / sale_item_id
    });
    res.json(data);
  } catch (err) {
    console.error("Error fetching sales items:", err);
    res.status(500).json({ message: "Error fetching sales items" });
  }
};



// GET /sales/:sale_id/items
exports.getSaleItems = async (req, res) => {
  try {
    const { saleId } = req.params;

    if (!saleId) return res.status(400).json({ message: "Sale ID required" });

    const items = await SalesItems.findAll({
      where: { sale_id: saleId },
      include: [
        {
          model: Item,
          as: "item",
          attributes: ["item_id", "name"],
        },
      ],
    });

    // Map to frontend-friendly format
    const formatted = items.map((i) => ({
      item_id: i.item_id,
      item_name: i.item.name,
      rate: i.rate,
      qty: i.qty,
      batch_no: i.batch_no,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

