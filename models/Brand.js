const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    Image_Url: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", ImageSchema);

