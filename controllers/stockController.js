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
