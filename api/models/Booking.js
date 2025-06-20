const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: String,
  contact: String,
  date: Date,
  service: String,
  notes: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
