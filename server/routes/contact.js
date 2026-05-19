const router = require("express").Router();
const Contact = require("../models/Contact");
const auth = require("../middleware/auth");

// POST a new contact message (open to everyone)
router.post("/", async (req, res) => {
  try {
    const newContact = new Contact({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    });
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit message" });
  }
});

// GET all contact messages (Admin only)
router.get("/all", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json("Admin access required");
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
