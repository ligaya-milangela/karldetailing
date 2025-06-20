const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., "Interior", "Exterior"
  description: { type: String },
  price: { type: Number, default: 0 }
});

module.exports = mongoose.model('Service', ServiceSchema);
