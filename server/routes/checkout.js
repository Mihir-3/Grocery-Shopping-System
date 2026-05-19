const router = require("express").Router();
const Checkout = require("../models/Checkout");
const auth = require("../middleware/auth");

// GET ALL CHECKOUT RECORDS (Admin)
router.get("/all", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json("Admin access required");
    const checkouts = await Checkout.find().sort({ createdAt: -1 });
    res.json(checkouts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
