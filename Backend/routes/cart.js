const Cart = require("../models/Cart");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");
const router = require("express").Router();

router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// verifyTokenAndAdmin VERIFY TOKEN AND ALSO CHECK IF Product IS AN ADMIN
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// //DELETE Product

// verifyTokenAndAdmin VERIFY TOKEN AND ALSO CHECK IF Product IS AN ADMIN
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedCart) {
      res.status(500).json(" Cart Product not found");
    }
    res.status(200).json(" Cart product has been deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET USER CART
//Everybody can see
router.get("/find/:userId", verifyTokenAndAuthorization , async (req, res) => {
  try {
    const getCart = await Cart.findOne({userId : req.params.userId});
    if (!getCart) {
      res.status(500).json("Product not found");
    }
    res.status(200).json(getCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET ALL Carts of all users
//Everybody can see
router.get("/", verifyTokenAndAdmin,async (req, res) => {
  try {
      const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
