const express = require('express');
const { getAllCustomer, getCustomerById, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');



const customerRouter = express.Router();


// Routes
customerRouter.get('/', getAllCustomer);
customerRouter.get('/:id', getCustomerById);
customerRouter.post('/', createCustomer);
customerRouter.put('/:id', updateCustomer);
customerRouter.delete('/:id', deleteCustomer);

module.exports = customerRouter;