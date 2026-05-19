require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Product = require('./models/Product');
  await Product.updateMany({ category: { $regex: /Dairy/i } }, { category: 'Other' });
  console.log('Updated db');
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
