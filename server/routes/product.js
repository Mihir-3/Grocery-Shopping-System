const router = require("express").Router();
const Product = require("../models/Product");

// ✅ GET all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ✅ GET product by id
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json("Product not found");
    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

const auth = require("../middleware/auth");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "onlinestore_products",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "avif"]
  }
});
const upload = multer({ storage: storage });

// ✅ ADD product (Admin) - With Image Upload Support
router.post("/", auth, (req, res, next) => {
  upload.single("image")(req, res, function (err) {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(400).json("Image upload failed: " + (err.message || "Invalid file format"));
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json("Admin access required");
    
    // Check if an image was uploaded, then use the Cloudinary URL.
    // If not uploaded, fallback to the text link provided (if any).
    const imageUrl = req.file ? req.file.path : req.body.image;

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      image: imageUrl
    });
    
    await product.save();
    res.json(product);
  } catch (err) {
    console.error("Database or Server Error in /api/products:", err);
    res.status(500).json({ error: err.message || err });
  }
});

// ✅ EDIT product (Admin)
router.put("/:id", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json("Admin access required");
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ DELETE product (Admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json("Admin access required");
    await Product.findByIdAndDelete(req.params.id);
    res.json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;