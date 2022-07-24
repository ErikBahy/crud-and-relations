const express = require("express");
const { parseMapToJSON } = require("source-map-resolve");
const router = express.Router();
const Order = require("./models/Order");
const Product = require("./models/Product");

// Route to get all orders
/**
 * @swagger
 * /orders:
 *   get:
 *     description: All orders
 *     responses:
 *       200:
 *         description: Returns all the orders
 */

router.get("/", async (req, res, next) => {
  try {
    res.json(await Order.find());
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err });
  }
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

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The order ID.
 *     description: Delete an order by id
 *     responses:
 *       200:
 *         description: deletes the requested order
 */

router.delete("/:orderId", async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const removedOrder = await Order.remove({ _id: orderId });

    res.status(200).json(removedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
});

module.exports = router;
