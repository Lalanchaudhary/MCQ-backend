const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
  },
  phone: {
    type: String, // 🔹 Change from Number to String
    unique: true,
    trim: true, // 🔹 Ensures no extra spaces
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // 🔹 Ensures emails are stored in lowercase
  },
  password: {
    type: String,
  },
  dob: {
    type: Date, // 🔹 Change from String to Date for better validation
  },
  gender:{
    type:String
  },
  image: {
    type: String,
  },
  AuthType:{
    type:String
  }
});

// Create the model
const User = mongoose.model("User", UserSchema);

module.exports = User;
