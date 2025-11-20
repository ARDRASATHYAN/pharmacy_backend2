const express = require('express');
const { getAllStock, getStoreStockByStoreAndItem } = require('../controllers/stockController');



const stockRouter = express.Router();


// Routes
stockRouter.get('/', getAllStock);
stockRouter.get("/store-stock", getStoreStockByStoreAndItem);


module.exports = stockRouter;