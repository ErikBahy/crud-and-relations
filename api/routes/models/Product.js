const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  img: String,
  price: Number,
  company: String,
  info: String,
  inCart: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Product", productSchema);
