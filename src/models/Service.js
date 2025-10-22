const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  basePrice: Number,
  category: String,
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
