const Customer = require("../models/CustomerModel");



// ✅ Get all Customer records
exports.getAllCustomer = async (req, res) => {
  try {
    const data = await Customer.findAll();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Customer:', error);
    res.status(500).json({ message: 'Error fetching Customer data' });
  }
};

// ✅ Get a single Customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Customer by ID' });
  }
};

// ✅ Create a new Customer record
exports.createCustomer = async (req, res) => {
  try {
    const { customer_name, address,gst_no,phone ,email,doctor_name,prescription_no } = req.body;
    const newCustomer = await Customer.create({ customer_name, address,gst_no,phone ,email,doctor_name,prescription_no });
    res.status(201).json({ message: 'Customer created successfully', data: newCustomer });
  } catch (error) {
    console.error('Error creating Customer:', error);
    res.status(500).json({ message: 'Error creating Customer' });
  }
};

// ✅ Update existing Customer
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const {customer_name, address,gst_no,phone ,email,doctor_name,prescription_no } = req.body;

    const customer = await Customer.findByPk(id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    await customer.update({ customer_name, address,gst_no,phone ,email,doctor_name,prescription_no });
    res.json({ message: 'Customer updated successfully', data: customer });
  } catch (error) {
    console.error('Error updating Customer:', error);
    res.status(500).json({ message: 'Error updating Customer' });
  }
};

// ✅ Delete an Customer record
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.destroy({ where: { customer_id: id } });

    if (!deleted) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting Customer:', error);
    res.status(500).json({ message: 'Error deleting Customer' });
  }
};
