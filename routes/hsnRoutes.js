const express = require('express');
const { getAllHSN, getHSNById, createHSN, updateHSN, deleteHSN } = require('../controllers/hsnController');
const hsnRouter = express.Router();


// Routes
hsnRouter.get('/',getAllHSN);
hsnRouter.get('/:id',getHSNById);
hsnRouter.post('/', createHSN);
hsnRouter.put('/:id', updateHSN);
hsnRouter.delete('/:id', deleteHSN);

module.exports = hsnRouter;
