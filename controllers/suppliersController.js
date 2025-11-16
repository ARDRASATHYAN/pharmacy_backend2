const Supplier = require("../models/SupplierModel");



// ✅ Get all Supplier records
exports.getAllSupplier = async (req, res) => {
  try {
    const data = await Supplier.findAll();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Supplier:', error);
    res.status(500).json({ message: 'Error fetching Supplier data' });
  }
};

// ✅ Get a single Supplier by ID
exports.getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Supplier by ID' });
  }
};

// ✅ Create a new Supplier record
exports.createSupplier = async (req, res) => {
  try {
    const { supplier_name, address, state, gst_no,phone ,email } = req.body;
    const newSupplier = await Supplier.create({ supplier_name, address, state, gst_no,phone ,email });
    res.status(201).json({ message: 'Supplier created successfully', data: newSupplier });
  } catch (error) {
    console.error('Error creating Supplier:', error);
    res.status(500).json({ message: 'Error creating Supplier' });
  }
};

// ✅ Update existing Supplier
exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const {supplier_name, address, state, gst_no,phone ,email } = req.body;

    const supplier = await Supplier.findByPk(id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

    await supplier.update({ supplier_name, address, state, gst_no,phone ,email });
    res.json({ message: 'Supplier updated successfully', data: supplier });
  } catch (error) {
    console.error('Error updating Supplier:', error);
    res.status(500).json({ message: 'Error updating Supplier' });
  }
};

// ✅ Delete an Supplier record
exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Supplier.destroy({ where: { Supplier_id: id } });

    if (!deleted) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting Supplier:', error);
    res.status(500).json({ message: 'Error deleting Supplier' });
  }
};
