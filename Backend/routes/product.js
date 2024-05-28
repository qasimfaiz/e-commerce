const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const { v4: uuidv4 } = require("uuid");

const {
  createProductSchema,
  updateProductSchema,
} = require("../validations/productValidation");
const { uploadWithoutFilter } = require("../utils/multer");

//ONLY ADD CAN CREATE PRODUCT
router.post(
  "/",
  uploadWithoutFilter.single("image"),
  verifyTokenAndAdmin,
  async (req, res) => {
    const { title, description, categories, price } = req.body;
    const validateCategories = JSON.parse(categories);
    const { error } = createProductSchema.validate({
      title,
      description,
      categories: validateCategories,
      price,
      image: req.file,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // Parse the categories field as JSON
    const parsedCategories = JSON.parse(categories);
    const img = req.file; // The uploaded file can be)
    try {
      let image = {}; // Object for image data

      if (img) {
        const publicId = uuidv4(); // Format the publicId as "products/publicid"
        const uploadResponse = await cloudinary.uploader.upload(img.path, {
          public_id: "product-" + publicId,
          folder: "shopswift-fyp/products", // Specify the folder path
        });

        if (uploadResponse) {
          const imageUrl = uploadResponse.secure_url;
          const ResponsePublicId = uploadResponse.public_id;

          const uniqueIdentifier = ResponsePublicId.split("/").pop();
          image = {
            publicId: uniqueIdentifier,
            url: imageUrl,
          };
        }
      }

      const newProduct = new Product({
        title,
        price,
        description,
        image,
        categories: parsedCategories,
      });

      const savedProduct = await newProduct.save();
      res.status(200).json({ message: "Product has been created" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//ONLY ADD CAN UPDATE PRODUCT
router.patch(
  "/:id",
  uploadWithoutFilter.single("image"),
  verifyTokenAndAdmin,
  async (req, res) => {
    const { title, description, categories, price } = req.body;
    const validateCategories = JSON.parse(categories);
    const { error } = updateProductSchema.validate({
      title,
      description,
      categories: validateCategories,
      price,
      image: req.file,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // Parse the categories field as JSON
    const parsedCategories = JSON.parse(categories);
    const img = req.file; // The uploaded file can be)
    let updateObj = {};

    try {
      // Check if an image was uploaded
      if (img) {
        const product = await Product.findById(req.params.id);
        let ProductPublicId = product.image.publicId || "";
        if (ProductPublicId) {
          // Delete the existing image
          await cloudinary.uploader.destroy(
            `shopswift-fyp/products/${ProductPublicId}`,
            { invalidate: true }
          );
        }
        const publicId = uuidv4(); // Format the publicId as "products/publicid"
        const uploadResponse = await cloudinary.uploader.upload(img.path, {
          public_id: "product-" + publicId,
          folder: "shopswift-fyp/products", // Specify the folder path
        });

        if (uploadResponse) {
          const imageUrl = uploadResponse.secure_url;
          const ResponsePublicId = uploadResponse.public_id;
          const uniqueIdentifier = ResponsePublicId.split("/").pop();
          const image = {
            publicId: uniqueIdentifier,
            url: imageUrl,
          };

          updateObj = {
            // Update the object with image data if it exists
            title,
            description,
            categories: parsedCategories,
            price,
            image,
          };
        }
      } else {
        // If no image was uploaded, update only the other fields
        updateObj = {
          title,
          description,
          categories: parsedCategories,
          price,
        };
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: updateObj,
        },
        { new: true }
      );

      res.status(200).json({ message: "Product has been updated" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//ONLY ADD CAN DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    let publicId = deletedProduct.image.publicId || "";
    if (!deletedProduct) {
      res.status(500).json({ message: "Product not found" });
    }

    // If publicId exists, delete the corresponding image
    if (publicId) {
      await cloudinary.uploader.destroy(`shopswift-fyp/products/${publicId}`, {
        invalidate: true,
      });
    }

    res.status(200).json({ message: "Product has been deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET Product
//Everybody can see
router.get("/find/:id", async (req, res) => {
  try {
    const getProduct = await Product.findById(req.params.id);
    if (!getProduct) {
      res.status(500).json({ message: "Product not found" });
    }
    res.status(200).json(getProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET ALL Products
//Everybody can see
router.get("/", async (req, res) => {
  try {
    const { qCategory, search, sort, currentPage, postsPerPage } = req.query;

    let queryObj = {};

    if (qCategory) {
      queryObj.categories = {
        $in: [qCategory],
      };
    }

    if (search) {
      queryObj.title = { $regex: search, $options: "i" };
    }

    let totalsProducts;
    let products;

    // Pagination
    let skip = (parseInt(currentPage) - 1) * parseInt(postsPerPage);

    let sortOptions;
    if (!sort || sort === "newest") {
      sortOptions = {
        createdAt: -1,
      };
    } else if (sort === "asc") {
      sortOptions = {
        price: 1,
      };
    } else if (sort === "desc") {
      sortOptions = {
        price: -1,
      };
    }

    if (Object.keys(queryObj).length === 0) {
      // No filters applied, fetch all products in the database
      totalsProducts = await Product.countDocuments();
      products = await Product.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(postsPerPage);
    } else {
      // for new products
      let sortOption;
      if (!sort || sort === "newest") {
        sortOption = {
          createdAt: -1,
        };
      }
      // Filters applied, fetch filtered products without sorting
      totalsProducts = await Product.countDocuments(queryObj);
      const unsortedProducts = await Product.find(queryObj)
        .sort(sortOption)
        .skip(skip)
        .limit(postsPerPage);

      // Sort only the products present on the current page
      products = unsortedProducts.sort((a, b) => {
        if (sort === "asc") {
          return a.price - b.price;
        } else if (sort === "desc") {
          return b.price - a.price;
        }
      });
    }

    res.status(200).json({ products, totalsProducts });
  } catch (error) {
    console.error("An error occurred while fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
