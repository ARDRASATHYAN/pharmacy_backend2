const express = require("express");
const { createDamagedStock, getDamagedStock } = require("../controllers/DamagedStockController");
const damagedStockRouter = express.Router();


damagedStockRouter.post("/", createDamagedStock);
damagedStockRouter.get("/", getDamagedStock);

module.exports = damagedStockRouter;
