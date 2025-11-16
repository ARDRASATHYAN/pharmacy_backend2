const express = require('express');
const { getAllItems, getItemById, createItem, updateItem, deleteItem } = require('../controllers/itemController');
const itemsRouter = express.Router();


// Routes
itemsRouter.get('/', getAllItems);
itemsRouter.get('/:id', getItemById);
itemsRouter.post('/', createItem);
itemsRouter.put('/:id', updateItem);
itemsRouter.delete('/:id', deleteItem);

module.exports = itemsRouter;
