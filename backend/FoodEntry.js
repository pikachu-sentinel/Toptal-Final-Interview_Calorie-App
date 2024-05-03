// FoodEntry.js
const mongoose = require('mongoose');

const foodEntrySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  eatenAt: {
    type: Date,
    default: Date.now,
  },
});

const FoodEntry = mongoose.model('FoodEntry', foodEntrySchema);

module.exports = FoodEntry;
