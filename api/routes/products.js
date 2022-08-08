const express = require("express");
const router = express.Router();
const Product = require("./models/Product");

const mongoose = require("mongoose");

//get all  products
/**
 * @swagger
 * /products:
 *   get:
 *     description: All products
 *     responses:
 *       200:
 *         description: Returns all the products
 */

router.get("/", async (req, res, next) => {
  try {
    res.json(await Product.find());
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err });
  }
});

// create a product
/**
 * @swagger
 * /products:
 *   post:
 *     parameters:
 *      - in: body
 *        name: product
 *        description: New product
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *            price:
 *              type: number
 *
 *     responses:
 *       201:
 *         description: Created
 */

// router.post("/", (req, res, next) => {
//   const product = new Product({
//     _id: new mongoose.Types.ObjectId(),
//     name: req.body.name,
//     price: req.body.price,
//   });
//   product
//     .save()
//     .then((result) => {
//       console.log(result);
//       res.status(201).json({
//         message: "handling POST requests to /products",
//         createdProduct: result,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ error: err });
//     });
// });
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      title: req.body.title,
      img: req.body.img,
      price: req.body.price,
      company: req.body.company,
      info: req.body.info,
    });
    await newProduct.save();
    res.json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

//add an order`

/**
 * @swagger
 * /products/{id}:
 *   post:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The product ID.
 *      - in: body
 *        name: product
 *        description: Update product
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *            quantity:
 *              type: string
 *
 *     responses:
 *       201:
 *         description: Created
 */

/*router.post("/:id", function (req, res) {
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
*/

router.post("/:id", async (req, res) => {
  try {
    const dbOrder = await Order.create(req.body);
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { orders: dbOrder._id } },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.json(error);
  }
});

// Route for retrieving a Product by id and populating it's orders.

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The product ID.
 *     description: Get a product by id
 *     responses:
 *       200:
 *         description: Returns the requested product
 */

router.get("/:id", async (req, res) => {
  try {
    const populateProduct = await Product.findOne({
      _id: req.params.id,
    }); //.populate("orders");
    res.json(populateProduct);
  } catch (error) {
    res.json(error);
  }
});

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The product ID.
 *      - in: body
 *        name: product
 *        description: Update product
 *        schema:
 *          type: array
 *          properties:
 *            propName:
 *              type: string
 *            value:
 *              type: string
 *
 *     responses:
 *       201:
 *         description: Created
 */

router.patch("/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The product ID.
 *     description: Delete a product by id
 *     responses:
 *       200:
 *         description: Returns the requested product
 */

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const removedProduct = await Product.remove({ _id: id });

    res.status(200).json(removedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
});

module.exports = router;
