const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerName: { type: String, required: true },
  delivery: { type: String, required: true },
  paymentMethod: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Checkout", checkoutSchema);
