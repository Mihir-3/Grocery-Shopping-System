const router = require("express").Router();
const Category = require("../models/Category");
const auth = require("../middleware/auth");

// GET ALL CATEGORIES
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE CATEGORY (Admin Only)
router.post("/", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json("Admin access required");
    const newCategory = new Category({ name: req.body.name });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE CATEGORY (Admin Only)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json("Admin access required");
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json("Category deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
