const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: { type: Object, required: true },
    products: [
      {
        _id: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        image: {
          publicId: { type: String },
          url: { type: String },
        },
        qty: { type: Number },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
