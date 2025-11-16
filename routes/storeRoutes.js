const express = require('express');
const { getAllStore, getStoreById, createStore, updateStore, deleteStore } = require('../controllers/storeController');


const storeRouter = express.Router();


// Routes
storeRouter.get('/', getAllStore);
storeRouter.get('/:id', getStoreById);
storeRouter.post('/', createStore);
storeRouter.put('/:id', updateStore);
storeRouter.delete('/:id', deleteStore);

module.exports = storeRouter;