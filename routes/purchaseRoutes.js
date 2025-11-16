const express = require('express');
const { createPurchase } = require('../controllers/purchaseController');
const purchaseRouter = express.Router();


// ==============================
// Purchase Invoice Routes
// ==============================

// Create a new purchase (with items + stock update)
purchaseRouter.post('/', createPurchase);

// // Get all purchases (optional: pagination, filters)
// purchaseRouter.get('/purchases', getAllPurchases);

// // Get a single purchase by ID (with items)
// purchaseRouter.get('/purchase/:id', getPurchaseById);

// // Update purchase (optional)
// purchaseRouter.put('/purchase/:id', updatePurchase);

// // Delete purchase (optional)
// purchaseRouter.delete('/purchase/:id', deletePurchase);

module.exports = purchaseRouter;
