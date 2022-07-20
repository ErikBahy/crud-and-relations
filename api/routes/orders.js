const express = require("express");
const { parseMapToJSON } = require("source-map-resolve");
const router = express.Router();
const Order = require("./models/Order");

// Route to get all reviews
router.get("/", function (req, res) {
  Order.find({})
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      res.json(err);
    });
});
router.post("/", (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity,
  };
  res.status(201).json({
    message: "order was created",
    order: order,
  });
});

router.patch("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "order details",
    orderId: req.params.orderID,
  });
});
router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "order delet",
    orderId: req.params.orderID,
  });
});

module.exports = router;
