const Order = require("../models/Order");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");
const router = require("express").Router();

//Create Order
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  console.log("new order", req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//ONLY ADMIN CAN UPDATE ORDER
router.patch("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { status } = req.body; // Destructure the status field from the request body

    await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status }, // Only update the 'status' field
      },
      { new: true }
    );
    const statusMessages = {
      pending: "Order status set to 'Pending'",
      processing: "Order status set to 'Active'",
      cancelled: "Order status set to 'Cancelled'",
      delivered: "Order status set to 'Delivered'",
    };

    const successMessage =
      statusMessages[req.body.status] || "Order has been updated";
    res.status(200).json({ message: successMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//ONLY ADMIN CAN DELETE ORDER
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Order has been deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET USER ORDERS
//ONLY AUTHORIZED USER CAN SEE AND ALSO ADMIN
router.get("/all/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const getOrders = await Order.find({ "customer._id": req.params.id });
    res.status(200).json(getOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET USER SINGLE ORDER
//ONLY AUTHORIZED USER CAN SEE AND ALSO ADMIN
router.get(
  "/detail/:OrderId/:id",
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      const getOrders = await Order.find({
        _id: req.params.OrderId,
        "customer._id": req.params.id,
      });
      res.status(200).json(getOrders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//GET ALL ORDERS FROM ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
