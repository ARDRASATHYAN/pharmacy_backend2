const express = require('express');
const { getAllStock } = require('../controllers/stockController');



const stockRouter = express.Router();


// Routes
stockRouter.get('/', getAllStock);


module.exports = stockRouter;