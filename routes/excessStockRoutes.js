const express = require("express");
const { getExcessStock, createExcessStock } = require("../controllers/ExcessStockController");
const excessStockRouter = express.Router();


excessStockRouter.post("/",createExcessStock);
excessStockRouter.get("/",getExcessStock);

module.exports = excessStockRouter;
