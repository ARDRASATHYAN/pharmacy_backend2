const HSN = require("../models/HsnModel");


// ✅ Get all HSN records
exports.getAllHSN = async (req, res) => {
  try {
    const data = await HSN.findAll();
    res.json(data);
  } catch (error) {
    console.error('Error fetching HSN:', error);
    res.status(500).json({ message: 'Error fetching HSN data' });
  }
};

// ✅ Get a single HSN by ID
exports.getHSNById = async (req, res) => {
  try {
    const { id } = req.params;
    const hsn = await HSN.findByPk(id);
    if (!hsn) return res.status(404).json({ message: 'HSN not found' });
    res.json(hsn);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching HSN by ID' });
  }
};

// ✅ Create a new HSN record
exports.createHSN = async (req, res) => {
  try {
    const { hsn_code, description, gst_percent } = req.body;
    const newHSN = await HSN.create({ hsn_code, description, gst_percent });
    res.status(201).json({ message: 'HSN created successfully', data: newHSN });
  } catch (error) {
    console.error('Error creating HSN:', error);
    res.status(500).json({ message: 'Error creating HSN' });
  }
};

// ✅ Update existing HSN
exports.updateHSN = async (req, res) => {
  try {
    const { id } = req.params;
    const { hsn_code, description, gst_percent } = req.body;

    const hsn = await HSN.findByPk(id);
    if (!hsn) return res.status(404).json({ message: 'HSN not found' });

    await hsn.update({ hsn_code, description, gst_percent });
    res.json({ message: 'HSN updated successfully', data: hsn });
  } catch (error) {
    console.error('Error updating HSN:', error);
    res.status(500).json({ message: 'Error updating HSN' });
  }
};

// ✅ Delete an HSN record
exports.deleteHSN = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HSN.destroy({ where: { hsn_id: id } });

    if (!deleted) return res.status(404).json({ message: 'HSN not found' });
    res.json({ message: 'HSN deleted successfully' });
  } catch (error) {
    console.error('Error deleting HSN:', error);
    res.status(500).json({ message: 'Error deleting HSN' });
  }
};
