
const express = require("express");
const { getRoles } = require("../controllers/roleController");
const roleRouter = express.Router();


roleRouter.get("/", getRoles);

module.exports = roleRouter;
