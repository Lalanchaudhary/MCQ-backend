const Test = require('../models/test');

const CreateTest = async (req, res) => {
  try {
    const { body, file } = req;
    console.log("Received Data:", req.body);

    // Parse the questions JSON string
    const parsedQuestions = JSON.parse(body.questions);

    const newTest = new Test({
      name: body.name,
      questions: parsedQuestions,
      image: file ? `uploads/${file.filename}` : null,
      duration:body.duration
    });

    await newTest.save();
    res.status(201).json({
      message: 'Test saved successfully',
      data: newTest,
    });
  } catch (err) {
    console.error('Error in CreateTest:', err);
    res.status(500).json({ error: err.message });
  }
};

const getAllTests = async (req, res) => {
  console.log("hello test");
  
  try {
    const tests = await Test.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({
      success: true,
      message: 'All tests fetched successfully',
      data: tests,
    });
  } catch (err) {
    console.error('Error in getAllTests:', err);
    res.status(500).json({ error: err.message });
  }
};


const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Test.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.status(200).json({ message: 'Test deleted successfully' });
  } catch (err) {
    console.error('Error in deleteTest:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { CreateTest ,getAllTests ,deleteTest};
