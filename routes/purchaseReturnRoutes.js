const express = require('express');
const { createPurchaseReturn, getPurchaseReturn, getPurchaseReturnItems } = require('../controllers/purchaseReturnController');
const puchaseReturnRouter = express.Router();


// Create a new purchase return
puchaseReturnRouter.post('/', createPurchaseReturn);

// // Optional: Get all purchase returns
puchaseReturnRouter.get('/', getPurchaseReturn);


 puchaseReturnRouter.get('/items',getPurchaseReturnItems);

// // Optional: Get a purchase return by ID (with items)
// puchaseReturnRouter.get('/:id', PurchaseReturnController.getPurchaseReturnById);

module.exports = puchaseReturnRouter;
