// routes/salesReturnRoutes.js
const express = require("express");
const { createSalesReturn, getSalesReturns, getSalesReturnsItems } = require("../controllers/SalesReturnController");
const salesReturnRouter = express.Router();


salesReturnRouter.post("/",createSalesReturn);
salesReturnRouter.get("/",getSalesReturns);
salesReturnRouter.get("/items",getSalesReturnsItems);

module.exports = salesReturnRouter;
