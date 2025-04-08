const express = require("express");
const multer = require("multer");
const userRouter = express.Router();
const { SignUp, SignUpWithFaceBook, setupUser, Login, SendEmail, changePassword, getProfile ,getAllUser} = require("../controller/userController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Routes
userRouter.post("/signup", SignUp);
userRouter.post("/signupwithfacebook", SignUpWithFaceBook);
userRouter.put("/setup/:userId", upload.single("profileImage"), setupUser); // Updated route with Multer
userRouter.post("/login", Login);
userRouter.post("/sendemail", SendEmail);
userRouter.put("/changePassword", changePassword);
userRouter.get("/profile/:userId", getProfile);
userRouter.get("/users", getAllUser);

module.exports = userRouter;
