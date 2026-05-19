const router = require("express").Router();
const Order = require("../models/Order");
const Checkout = require("../models/Checkout");
const auth = require("../middleware/auth");

// CREATE ORDER
router.post("/", auth, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.id);
    
    let finalTotal = req.body.total;
    if (user && !user.hasUsedFirstDiscount) {
      // Backend confirmation of 50% discount
      finalTotal = finalTotal * 0.5;
      user.hasUsedFirstDiscount = true;
      await user.save();
    }

    const order = await Order.create({
      userId: req.user.id,
      items: req.body.items,
      total: finalTotal,
      address: req.body.address,
      paymentMethod: req.body.paymentMethod
    });

    await Checkout.create({
      orderId: order._id,
      customerName: user.name,
      delivery: req.body.address,
      paymentMethod: req.body.paymentMethod
    });

    res.json({ order, hasUsedFirstDiscount: true });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// GET USER ORDERS
router.get("/", auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});

// CANCEL ORDER (User)
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json("Order not found");
    
    // Ensure the order belongs to the user requesting cancellation
    if (order.userId !== req.user.id) return res.status(403).json("Not authorized");
    if (order.status !== "Pending") return res.status(400).json("Only pending orders can be cancelled");

    // We delete it instead of marking it cancelled per user requirement.
    await Order.findByIdAndDelete(req.params.id);

    // Check if we should refund the "hasUsedFirstDiscount" flag
    // We refund it if they have no other non-cancelled orders
    const User = require("../models/User");
    const otherValidOrders = await Order.find({ userId: req.user.id, status: { $ne: "Cancelled" } });
    if (otherValidOrders.length === 0) {
      await User.findByIdAndUpdate(req.user.id, { hasUsedFirstDiscount: false });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL ORDERS (Admin)
router.get("/all", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json("Admin access required");
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE ORDER STATUS (Admin)
router.put("/:id/status", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json("Admin access required");
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;