const express = require("express");
const multer = require("multer");
const testRouter = express.Router();
const {CreateTest,getAllTests ,deleteTest}=require('../controller/testController')

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
  });
  const upload = multer({ storage });
  
// Routes
testRouter.post("/addtest", upload.single("image"), CreateTest);
testRouter.get("/alltests", getAllTests); // <== New route added
testRouter.delete("/deletetest/:id", deleteTest); // ✅ Add this line
module.exports = testRouter;
