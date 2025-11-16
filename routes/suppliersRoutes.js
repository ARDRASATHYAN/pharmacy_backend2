const express = require('express');
const { getAllSupplier, getSupplierById, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/suppliersController');



const supplierRouter = express.Router();


// Routes
supplierRouter.get('/', getAllSupplier);
supplierRouter.get('/:id', getSupplierById);
supplierRouter.post('/', createSupplier);
supplierRouter.put('/:id', updateSupplier);
supplierRouter.delete('/:id', deleteSupplier);

module.exports = supplierRouter;