const Store = require("../models/StoresModel");


// ✅ Get all Store records
exports.getAllStore = async (req, res) => {
  try {
    const data = await Store.findAll();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Store:', error);
    res.status(500).json({ message: 'Error fetching Store data' });
  }
};

// ✅ Get a single Store by ID
exports.getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    const Stores = await Store.findByPk(id);
    if (!Stores) return res.status(404).json({ message: 'Store not found' });

    res.json(Stores);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Store by ID' });
  }

};




// ✅ Create a new Store record
exports.createStore = async (req, res) => {
  try {
    const { store_name, address, city, state, gst_no, phone, email } = req.body;
    const newStore = await Store.create({ store_name, address, city, state, gst_no, phone, email });
    res.status(201).json({ message: 'Store created successfully', data: newStore });
  } catch (error) {
    console.error('Error creating Store:', error);
    res.status(500).json({ message: 'Error creating Store' });
  }
};

// ✅ Update existing Store
exports.updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { store_name, address, city, state, gst_no, phone, email } = req.body;

    const store = await Store.findByPk(id);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    await store.update({ store_name, address, city, state, gst_no, phone, email });
    res.json({ message: 'Store updated successfully', data: store });
  } catch (error) {
    console.error('Error updating Store:', error);
    res.status(500).json({ message: 'Error updating Store' });
  }
};

// ✅ Delete an Store record
exports.deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Store.destroy({ where: { Store_id: id } });

    if (!deleted) return res.status(404).json({ message: 'Store not found' });
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Error deleting Store:', error);
    res.status(500).json({ message: 'Error deleting Store' });
  }
};
