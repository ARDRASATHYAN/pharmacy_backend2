const PurchaseItems = require("../models/PurchaseItemsModel");
const StoreStock = require("../models/StoreStockModel");




exports.getAllStock = async (req, res) => {
  try {
    const data = await StoreStock.findAll();
    res.json(data);
  } catch (error) {
    console.error('Error fetching HSN:', error);
    res.status(500).json({ message: 'Error fetching HSN data' });
  }
};



exports.getStoreStockByStoreAndItem = async (req, res) => {
  try {
    const { store_id, item_id } = req.query;

    if (!store_id) {
      return res.status(400).json({ message: "store_id is required" });
    }

    const where = { store_id };

    if (item_id) {
      where.item_id = item_id;
    }

    const data = await StoreStock.findAll({ where });
    res.json(data);
  } catch (err) {
    console.error("Error fetching store stock:", err);
    res.status(500).json({ message: "Error fetching store stock" });
  }
};
