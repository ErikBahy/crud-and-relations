const mongoose = require("mongoose");

const shoppingCartSchema = mongoose.Schema({
  user: String,

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: Number,
});

module.exports = mongoose.model("ShoppingCart", shoppingCartSchema);
