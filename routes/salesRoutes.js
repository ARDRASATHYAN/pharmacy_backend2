const express = require("express");
const { createSale, getAllSales, getSaleItems, getAllSalesItems } = require("../controllers/SalesController");
const salesRouter = express.Router();


salesRouter.post("/", createSale);
salesRouter.get("/", getAllSales);
salesRouter.get("/items", getAllSalesItems);
salesRouter.get("/:saleId/items", getSaleItems);



module.exports = salesRouter;
