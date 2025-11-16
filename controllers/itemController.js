const HSN = require('../models/HsnModel');
const DrugSchedule = require('../models/DrugScheduleModel');
const Item = require('../models/ItemsModel');

// ✅ Get all items (with related HSN and Drug Schedule)
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [
        { model: HSN, as: 'hsn', attributes: ['hsn_id', 'hsn_code', 'description', 'gst_percent'] },
        { model: DrugSchedule, as: 'schedule', attributes: ['schedule_id', 'schedule_code', 'schedule_name'] },
      ],
      order: [['item_id', 'ASC']],
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items', error });
  }
};

// ✅ Get single item by ID
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id, {
      include: [
        { model: HSN, as: 'hsn' },
        { model: DrugSchedule, as: 'schedule' },
      ],
    });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    console.error('Error fetching item by ID:', error);
    res.status(500).json({ message: 'Error fetching item', error });
  }
};

// ✅ Create new item
exports.createItem = async (req, res) => {
  try {
    const {
      sku,
      barcode,
      name,
      brand,
      generic_name,
      manufacturer,
      hsn_id,
      schedule_id,
      description,
      item_type,
      pack_size,
      is_active,
    } = req.body;

    const newItem = await Item.create({
      sku,
      barcode,
      name,
      brand,
      generic_name,
      manufacturer,
      hsn_id,
      schedule_id,
      description,
      item_type,
      pack_size,
      is_active,
    });

    res.status(201).json({ message: 'Item created successfully', data: newItem });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Error creating item', error });
  }
};

// ✅ Update item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sku,
      barcode,
      name,
      brand,
      generic_name,
      manufacturer,
      hsn_id,
      schedule_id,
      description,
      item_type,
      pack_size,
      is_active,
    } = req.body;

    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.update({
      sku,
      barcode,
      name,
      brand,
      generic_name,
      manufacturer,
      hsn_id,
      schedule_id,
      description,
      item_type,
      pack_size,
      is_active,
    });

    res.json({ message: 'Item updated successfully', data: item });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Error updating item', error });
  }
};

// ✅ Delete item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Item.destroy({ where: { item_id: id } });
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Error deleting item', error });
  }
};
