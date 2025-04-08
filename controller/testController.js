// routes/test.js
const express = require('express');
const Test = require('../models/test');

const CreateTest = async (req, res) => {
  try {
    const newTest = new Test(req.body);
    await newTest.save();
    res.status(201).json({ message: 'Test saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {CreateTest};
