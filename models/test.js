const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  option1: { type: String, required: true },
  option2: { type: String, required: true },
  option3: { type: String, required: true },
  option4: { type: String, required: true },
  answer: { type: String, required: true },
});

const TestSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  time: {
    type: String, // Keeping it string as you mentioned earlier
  },
  questions: [QuestionSchema], // 👈 Correctly define questions as an array of objects
});

const Test = mongoose.model("Test", TestSchema);

module.exports = Test;
