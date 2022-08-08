const express = require("express");
const router = express.Router();
const Product = require("./models/Product");

const User = require("./models/User");
const ShoppingCart = require("./models/ShoppingCart");
var ObjectId = require("mongodb").ObjectId;

const mongoose = require("mongoose");

router.get("/", async (req, res, next) => {
  try {
    res.json(await ShoppingCart.find().populate("product"));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err });
  }
});
// router.post("/", async (req, res) => {
//     try {
//       const shoppingCart = new ShoppingCart({

//       });
//       await shoppingCart.save();
//       res.json(shoppingCart);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: error });
//     }
//   });
//   router.delete("/:id", async (req, res, next) => {
//     const id = req.params.id;
//     try {
//       const removedProduct = await ShoppingCart.remove({ _id: id });

//       res.status(200).json(removedProduct);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({
//         error: error,
//       });
//     }
//   });
//   router.delete("/", async (req, res, next) => {

//     try {
//       const removedProduct = await ShoppingCart.remove({ });

//       res.status(200).json(removedProduct);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({
//         error: error,
//       });
//     }
//   });

router.post("/", async (req, res) => {
  const productId = req.body._id;

  console.log(productId);

  const userId = "5de7ffa74fff640a0491bc4f"; //TODO: the logged in user id

  try {
    let carts = await ShoppingCart.findOne({
      user: { _id: new ObjectId(userId) },
      product: { _id: new ObjectId(productId) },
    });
    console.log(carts);
    if (carts) {
      let newQuantity = carts.quantity + 1;
      //cart exists for user
      const updatedCart = await ShoppingCart.updateOne(
        {
          _id: carts._id,
        },
        { quantity: newQuantity }
      );
      return res.status(201).send(updatedCart);
    } else {
      //no cart for user, create new cart
      console.log(productId);

      ShoppingCart.init();
      const newCart = new ShoppingCart({
        user: { _id: new ObjectId(userId) },
        product: { _id: new ObjectId(productId) },
        quantity: 1,
      });
      await newCart.save();

      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

router.post("/decrement", async (req, res) => {
  const productId = req.body._id;

  console.log(productId);

  const userId = "5de7ffa74fff640a0491bc4f"; //TODO: the logged in user id

  try {
    let carts = await ShoppingCart.findOne({
      user: { _id: new ObjectId(userId) },
      product: { _id: new ObjectId(productId) },
    });
    console.log(carts);
    if (carts.quantity > 1) {
      const newQuantity = carts.quantity - 1;
      const updatedCart = await ShoppingCart.updateOne(
        {
          _id: carts._id,
        },
        { quantity: newQuantity }
      );
      return res.status(201).send(updatedCart);
    } else {
      const deletedCart = await ShoppingCart.remove({ _id: carts._id });

      return res.status(201).send(deletedCart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});
router.get("/:id", async (req, res) => {
  try {
    const populateCart = await ShoppingCart.findOne({
      _id: new ObjectId(req.params.id),
    }).populate("product");
    res.json(populateCart);
  } catch (error) {
    res.json(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const clearCart = await ShoppingCart.remove();

    res.status(200).json(clearCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
});
router.delete("/:_id", async (req, res, next) => {
  const id = req.params._id;
  try {
    const removedProduct = await ShoppingCart.remove({ _id: id });

    res.status(200).json(removedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
});

module.exports = router;
