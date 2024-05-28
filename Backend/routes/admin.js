const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("./verifyToken");
const {
  UpdateProfileScheme,
  EditUserScheme,
} = require("../validations/userValidation");
const cloudinary = require("../utils/cloudinary");
const { v4: uuidv4 } = require("uuid");
const upload = require("../utils/multer");

router.get("/getAdminDetail", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // if (user.role !== "admin") {
    //   return res
    //     .status(401)
    //     .json({ message: "You are not authorized to view this page." });
    // }
    // console.log("admin login status", user);
    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
router.get("/getAllUsers", verifyTokenAndAdmin, async (req, res) => {
  try {
    const AllUsers = await User.find({ role: "user" }).select("-password");

    res.status(200).json(AllUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
router.get("/getAllAdmins", verifyTokenAndAdmin, async (req, res) => {
  try {
    const AllAdmins = await User.find({
      $or: [{ role: "admin" }, { role: "super admin" }],
    }).select("-password");
    // console.log("All admins", AllAdmins);
    res.status(200).json(AllAdmins);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
const uploadSingleImage = upload.single("profilePic");
router.patch("/admin/update-profile", verifyTokenAndAdmin, async (req, res) => {
  // Handle Multer error
  uploadSingleImage(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
  });
  try {
    const user = await User.findById(req.user.id);
    req.body.username = req.body.username || user.username;
    req.body.email = req.body.email || user.email;

    // Validate body
    const { error } = UpdateProfileScheme.validate(req.body, {
      allowUnknown: false, // Only validate fields defined in the schema
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (user) {
      // IF USER ENTERED A NEW PASSWORD, ENCRYPT IT AND SAVE
      if (!req.body.password) {
        return res.status(401).json({ message: "Enter your password" });
      }

      // Decrypting Password to compare with req.body.password
      const decrypted = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SECRET
      );
      // Converting to string
      let decryptedPass = decrypted.toString(CryptoJS.enc.Utf8);

      // Check if the entered password matches the user's current password
      if (req.body.password !== decryptedPass) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Checking if the entered email already exists for another user
      if (req.body.email && req.body.email !== user.email) {
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
          return res.status(409).json({ message: "Email is already in use" });
        }
      }

      // Uploading profile pic
      if (req.file) {
        let publicId = user.image.publicId || "";

        const file = req.file;
        if (publicId) {
          // Delete the existing image
          await cloudinary.uploader.destroy(`shopswift-fyp/users/${publicId}`, {
            invalidate: true,
          });
        }

        // Generate a unique public ID dynamically
        let newPublicId = uuidv4();

        const uploadResponse = await cloudinary.uploader.upload(file.path, {
          public_id: "user-" + newPublicId,

          overwrite: true,
          folder: "shopswift-fyp/users", // Specify the folder path
        });

        const profilePic = uploadResponse.secure_url;
        const ResponsePublicId = uploadResponse.public_id;

        // Extract the unique identifier from ResponsePublicId
        const uniqueIdentifier = ResponsePublicId.split("/").pop();
        // Save the profilePicUrl and publicId in your database or perform any necessary processing
        console.log(profilePic);
        req.body.image = { profilePic, publicId: uniqueIdentifier };
      }
      // optional fields

      const optionalFields = ["username", "email", "image"];
      optionalFields.forEach((field) => {
        if (field === "image") {
          user.image = req.body.image || user.image;
        } else {
          user[field] = req.body[field] || user[field];
        }
      });
      const userDetails = await user.save();

      const { password, ...updatedUser } = userDetails._doc;
      res
        .status(200)
        .json({ message: "Record has been updated", user: updatedUser });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove Profile Pic
router.post(
  "/admin/remove-profile",
  verifyTokenAndAuthorization,
  async (req, res) => {
    const user = await User.findById(req.body.id);
    let publicId = user.image.publicId;

    try {
      if (publicId) {
        // Delete the existing image
        await cloudinary.uploader.destroy(`shopswift-fyp/users/${publicId}`, {
          invalidate: true,
        });
      }

      const profilePic = "";
      // Save the profilePicUrl and publicId in your database or perform any necessary processing
      publicId = "";
      const responseObj = { profilePic, publicId };
      user.image = responseObj;
      await user.save();
      res.status(200).json({ message: "Profile pic removed successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);
//Update user detail
router.patch("/admin/:id", verifyTokenAndAdmin, async (req, res) => {
  console.log(req.body);
  try {
    const { error } = EditUserScheme.validate({
      username: req.body.username,
      email: req.body.email,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const user = await User.findById(req.params.id);
    if (user.role === "super admin" && req.user.role === "admin") {
      return res.status(403).json({
        message: "You do not have permission to perform this action.",
      });
    }

    if (user) {
      // Checking if the entered email already exists for another user
      if (req.body.email && req.body.email !== user.email) {
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
          return res.status(409).json({ message: "Email is already in use" });
        }
      }

      // optional fields

      const optionalFields = ["username", "email", "role", "status"];
      optionalFields.forEach((field) => {
        user[field] = req.body[field] || user[field];
      });
      const userDetails = await user.save();

      const { password, ...updatedUser } = userDetails._doc;
      res
        .status(200)
        .json({ message: "Record has been updated", user: updatedUser });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
