const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "" },
  contactNumber: { type: String, default: "" },
  address: { type: String, default: "" },
  isAdmin: { type: Boolean, default: false } // <-- NEW LINE
});

module.exports = mongoose.model('User', UserSchema);
