const express = require("express");
const router = express.Router();
const Product = require("./models/Product");
const Order = require("./models/Order");

const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "handling POST requests to /products",
        createdProduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});
router.post("/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  Order.create(req.body)
    .then(function (dbOrder) {
      // If a order was created successfully, find one Product with an `_id` equal to `req.params.id`. Update the Product to be associated with the new order
      // { new: true } tells the query that we want it to return the updated Product -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return Product.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { orders: dbOrder._id } },
        { new: true }
      );
    })
    .then(function (dbProduct) {
      // If we were able to successfully update a Product, send it back to the client
      res.json(dbProduct);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
// Route for retrieving a Product by id and populating it's orders.
router.get("/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Product.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("orders")
    .then(function (dbProduct) {
      // If we were able to successfully find an Product with the given id, send it back to the client
      res.json(dbProduct);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "no valid entry for given id",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
