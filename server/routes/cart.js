const router = require("express").Router();
let cart = [];

router.post("/add", (req, res) => {
  const item = cart.find(i => i.id === req.body.id);
  if (item) item.qty++;
  else cart.push({ ...req.body, qty: 1 });

  res.json(cart);
});

router.get("/", (req, res) => res.json(cart));

module.exports = router;