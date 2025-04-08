const express = require("express");
const multer = require("multer");
const testRouter = express.Router();
const {CreateTest}=require('../controller/testController')
// Routes
testRouter.post("/addtest", CreateTest);

module.exports = testRouter;
