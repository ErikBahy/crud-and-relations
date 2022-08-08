const express = require("express");
const Product = require("./api/routes/models/Product");
const productData = require("./data");

const importData = express.Router();

importData.post("/products", async (req, res) => {
  await Product.remove({});
  const importProducts = await Product.insertMany(productData);
  res.send({ importProducts });
});

module.exports = importData;
