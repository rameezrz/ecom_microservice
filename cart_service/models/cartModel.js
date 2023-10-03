const mongoose = require("mongoose");

const cartModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    products: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
        },
        quantity: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartModel);
