const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hash
  });

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET || "secret123"
  );

  res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, hasUsedFirstDiscount: user.hasUsedFirstDiscount } });
});

// LOGIN
router.post("/login", async (req, res) => {
  const user = await User.findOne({ 
    $or: [{ email: req.body.email }, { name: req.body.email }] 
  });

  if (!user) return res.status(400).send("User not found");

  const valid = await bcrypt.compare(req.body.password, user.password);

  if (!valid) return res.status(400).send("Invalid password");

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET || "secret123"
  );

  res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, hasUsedFirstDiscount: user.hasUsedFirstDiscount } });
});

// GET CURRENT USER PROFILE
const auth = require("../middleware/auth");
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json("User not found");
  res.json(user);
});
// GET ALL USERS (Admin)
router.get("/all", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json("Admin access required");
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;