const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema(
    {
      name: { type: String, required: true},
      lastname: { type: String, required: true},  
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      ConfirmPassword: { type: String, required: true },
      status: { type: String, enum: ['Approved', 'Pending', 'Rejected'], default: 'Pending' },
    },
    { timestamps: true }
  );

module.exports = mongoose.model("User", UserSchema);