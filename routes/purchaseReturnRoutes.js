const express = require('express');
const { createPurchaseReturn } = require('../controllers/purchaseReturnController');
const puchaseReturnRouter = express.Router();


// Create a new purchase return
puchaseReturnRouter.post('/', createPurchaseReturn);

// // Optional: Get all purchase returns
// puchaseReturnRouter.get('/', PurchaseReturnController.getAllPurchaseReturns);

// // Optional: Get a purchase return by ID (with items)
// puchaseReturnRouter.get('/:id', PurchaseReturnController.getPurchaseReturnById);

module.exports = puchaseReturnRouter;
