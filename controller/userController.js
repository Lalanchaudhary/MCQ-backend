const userModel = require("../models/user");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv=require('dotenv');
const moment = require('moment');
const nodemailer = require("nodemailer");
const multer = require('multer');
dotenv.config();
const SignUp = async (req, res) => {
  const { phone, email, password } = req.body;

  console.log("Received Data:", req.body); // Debug log

  // Check if required fields exist
  if (!phone || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    let user = await userModel.findOne({ phone });
    if (user) {
      return res.status(400).json({ message: "User with this phone already exists!" });
    }

    let user1 = await userModel.findOne({ email });
    if (user1) {
      return res.status(400).json({ message: "User with this email already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const HashPassword = await bcrypt.hash(password, salt);
    const newUser = await userModel.create({
      name:'',
      phone,
      email,
      password: HashPassword,
      dob: '',
      gender:'',
      image:'',
      AuthType:'EmailWithPassword'
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    console.log("User created successfully:", newUser);
    res.status(200).json({ token, userId: newUser._id, message: "User Registered Successfully" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const SignUpWithFaceBook = async (req, res) => {
  const { name, email ,image} = req.body;

  console.log("Received Data:", req.body); // Debug log

  // Check if required fields exist

  try {
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(200).json({userId: user._id, message: "User Registered Successfully" });
    }

    const newUser = await userModel.create({
      name,
      email,
      password:'',
      dob: '',
      gender:'',
      image,
      AuthType:'Facebook'
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    console.log("User created successfully:", newUser);
    res.status(200).json({ token, userId: newUser._id, message: "User Registered Successfully" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



const setupUser = async (req, res) => {
  const { userId } = req.params;
  let { name, dob, gender } = req.body;
  console.log("Received Data:", req.body);
  

  // Optional: If moment is used to format DOB
  if (dob) {
    dob = moment(dob, "DD/MM/YYYY").format("YYYY-MM-DD");
  }

  try {
    // Check if user exists
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Update user fields
    user.name = name || user.name;
    user.dob = dob || user.dob;
    user.gender = gender || user.gender;

    // Check if a file was uploaded and save its path
    if (req.file) {
      console.log("File uploaded:", req.file);
      user.image = req.file.path; // Save image path (e.g., 'uploads/16900000-profile.jpg')
    }

    // Save updated user
    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const Login = async (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or phone

  console.log("Received Data:", req.body); // Debug log

  // Check if required fields exist
  if (!identifier || !password) {
    return res.status(400).json({ message: "Email/Phone and password are required!" });
  }

  try {
    // Find user by email or phone
    let user = await userModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    console.log("User logged in successfully:", user);
    res.status(200).json({ token, userId: user._id, message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const SendEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log("Sending email to:", email, "OTP:", otp);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // ✅ Correct SMTP host
      port: 465, // ✅ Secure port for Gmail
      secure: true, // ✅ Use true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER, // ✅ Use environment variables
        pass: process.env.EMAIL_PASS, // ✅ Use your App Password
      },
    });

    const info = await transporter.sendMail({
      from: '"Support Team" <chaudharylalan28@gmail.com>', // ✅ Update sender email
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
      html: `<p>Your OTP code is: <b>${otp}</b></p>`,
    });

    console.log("Message sent: %s", info.messageId);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};

const changePassword = async (req, res) => {
  let { email, newPassword } = req.body;
  
  console.log("Received Request Body:", req.body);
  
  try {
    // Check if user exists
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getProfile = async (req, res) => {
  const { userId } = req.params;

  console.log('====================================');
  console.log("userId", userId);
  console.log('====================================');

  try {
    // Fetch user by ID (no need to parse it)
    const user = await userModel.findById(userId);
    
    // If user does not exist, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user is found, return the user data
    return res.status(200).json(user);
  
  } catch (err) {
    // Handle server errors and send a 500 status code with an error message
    return res.status(500).json({ message: "Server error", error: err });
  }
};




const getAllUser = async (req, res) => {
  console.log('====================================');
  console.log("Hello users");
  console.log('====================================');
  try {
    const users = await userModel.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// const getProfile = async (req, res) => {
//   const { userId } = req.params;

//   console.log('====================================');
//   console.log("userId", userId);
//   console.log('====================================');

//   try {
//     // Fetch user by ID (no need to parse it)
//     const user = await userModel.findById(userId);
    
//     // If user does not exist, return a 404 error
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // If user is found, return the user data
//     return res.status(200).json(user);
  
//   } catch (err) {
//     // Handle server errors and send a 500 status code with an error message
//     return res.status(500).json({ message: "Server error", error: err });
//   }
// };


// const UpdateRating = async (req, res) => {
//   try {
//     const { id, rating } = req.body;

//     const updatedUser = await userModel.findByIdAndUpdate(
//       id,
//       { $set: { rating } }, // Correct way to update a field
//       { new: true } // Returns updated document
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ message: "Rating updated successfully", updatedUser });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

module.exports = {SignUp,SignUpWithFaceBook,setupUser,Login ,SendEmail ,changePassword , getProfile ,getAllUser};
