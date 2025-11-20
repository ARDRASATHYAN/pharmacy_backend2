// routes/salesReturnRoutes.js
const express = require("express");
const { createSalesReturn, getSalesReturns } = require("../controllers/SalesReturnController");
const salesReturnRouter = express.Router();


salesReturnRouter.post("/",createSalesReturn);
salesReturnRouter.get("/sales-returns",getSalesReturns);

module.exports = salesReturnRouter;
