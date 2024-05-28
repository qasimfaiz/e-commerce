const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String,  required: true },
    products: [
        {
          _id: { type: String,  required: true },
          title: { type: String,  required: true },
          price: { type: Number,  required: true },
          image: { type: String,  required: true },
          qty: { type: Number ,default : 1 },
        }
    ],
    
  },
  { timestamps: true }
);


module.exports = mongoose.model("Cart", cartSchema);