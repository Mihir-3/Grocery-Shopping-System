const mongoose = require('mongoose');
require('dotenv').config();

const Order = require('./models/Order');
const Checkout = require('./models/Checkout');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/grocery")
  .then(async () => {
    console.log("Connected to DB to backfill checkouts...");

    const orders = await Order.find();
    console.log(`Found ${orders.length} target orders.`);

    let addedCount = 0;
    let updatedCount = 0;

    for (let order of orders) {
      // Find the user to get the name
      const user = await User.findById(order.userId);
      const customerName = user ? user.name : "Unknown Customer";

      // Check if checkout record already exists for this order
      const existingCheckout = await Checkout.findOne({ orderId: order._id.toString() });

      if (existingCheckout) {
        // If it exists but has no customerName or we need to update it
        if (!existingCheckout.customerName || existingCheckout.customerName === 'Unknown Customer') {
          existingCheckout.customerName = customerName;
          await existingCheckout.save();
          updatedCount++;
        }
      } else {
        // Doesn't exist, create it
        await Checkout.create({
          orderId: order._id.toString(),
          customerName: customerName,
          delivery: order.address || "Unknown Address",
          paymentMethod: order.paymentMethod || "Credit Card",
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        });
        addedCount++;
      }
    }

    console.log(`Backfill complete: Added ${addedCount} missing checkout records, updated ${updatedCount} existing records.`);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
