const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
  description: { type: String, default: "" }
});

module.exports = mongoose.model("Product", productSchema);