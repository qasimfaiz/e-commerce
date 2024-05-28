const CryptoJS = require("crypto-js");
const User = require("../models/User");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");
const { v4: uuidv4 } = require("uuid");
const {
  UpdateProfileScheme,
  ChangePasswordSchema,
  registrationSchema,
} = require("../validations/userValidation");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const router = require("express").Router();

//verifyTokenAndAuthorization VERIFY TOKEN AND ALSO CHECK IF USER IS HIMSELF BY USING TOKEN OR IT IS AN ADMIN
const uploadSingleImage = upload.single("profilePic");
router.patch(
  "/user/update-profile/:id",

  verifyTokenAndAuthorization,
  async (req, res) => {
    // Handle Multer error
    uploadSingleImage(req, res, function (err) {
      if (err) {
        return res.status(400).send({ message: err.message });
      }
    });

    try {
      const user = await User.findById(req.params.id);
      req.body.username = req.body.username || user.username;
      req.body.email = req.body.email || user.email;

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
            await cloudinary.uploader.destroy(
              `shopswift-fyp/users/${publicId}`,
              { invalidate: true }
            );
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

          req.body.image = { profilePic, publicId: uniqueIdentifier };
        }
        // optional fields

        const optionalFields = ["username", "email", "image"];
        optionalFields.forEach((field) => {
          user[field] = req.body[field] || user[field];
        });
        const userDetails = await user.save();

        const { password, ...updatedUser } = userDetails._doc;
        res.status(200).json({ message: "User has been updated", updatedUser });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Remove Profile Pic
router.post(
  "/user/remove-profile",
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
// Change Password
// Route for changing password
router.patch(
  "/change-password/:id",
  verifyTokenAndAuthorization,
  async (req, res) => {
    // // Trim leading and trailing spaces from the password field in req.body
    // const { newPassword } = req.body;
    // const trimmedPassword = newPassword.trim();

    // if (trimmedPassword.includes(" ")) {
    //   return res
    //     .status(400)
    //     .json({ message: "Password should not contains spaces" });
    // }

    try {
      // validate
      const { error } = ChangePasswordSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Decrypt the user's current password
      const decrypted = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SECRET
      );
      const decryptedPass = decrypted.toString(CryptoJS.enc.Utf8);

      // Check if the entered current password matches the user's current password
      if (decryptedPass !== req.body.password) {
        return res.status(401).json({ message: "Invalid current password" });
      }

      // Encrypt the new password
      const newEncryptedPassword = CryptoJS.AES.encrypt(
        req.body.newPassword,
        process.env.PASS_SECRET
      ).toString();

      // Update the user's password
      user.password = newEncryptedPassword;
      const updatedUser = await user.save();

      res.status(200).json({ message: "Password has been updated" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//GET USER
// verifyTokenAndAuthorization VERIFY TOKEN AND ALSO CHECK IF USER IS AN ADMIN
router.get(
  "/user-detail/:id",
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const { password, ...other } = user._doc;
      res.status(200).json(other);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VERIFY TOKEN AND ALSO CHECK IT IS AN ADMIN
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (
      user.role === "super admin" &&
      (req.user.role === "admin" || req.user.role === "user")
    ) {
      return res.status(403).json({
        message: "You do not have permission to perform this action.",
      });
    }

    if (user) {
      const { publicId } = user.image;

      // Delete the user
      const deletionResult = await User.findByIdAndDelete(req.params.id);

      if (deletionResult) {
        // User deleted successfully

        // If publicId exists, delete the corresponding image
        if (publicId) {
          await cloudinary.uploader.destroy(`shopswift-fyp/users/${publicId}`, {
            invalidate: true,
          });
        }
      }
    }

    res.status(200).json({ message: `${user.role} has been deleted` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add New user

router.post("/add-user", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { error } = registrationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    //Checking if user exsist in database
    const checkuser = await User.findOne({
      email: req.body.email,
    });

    if (checkuser) {
      return res.status(409).json({
        message: "User already exists. Please choose a different email.",
      });
    }

    let encryptedPassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString();

    req.body.role = "user";
    req.body.verified = true;

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: encryptedPassword,
      role: req.body.role,
      verified: req.body.verified,
    });

    // saving as new user
    const savedUser = await newUser.save();
    // const { password, ...other } = savedUser._doc;
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new admin

router.post("/add-admin", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { error } = registrationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    //Checking if user exsist in database
    const checkuser = await User.findOne({
      email: req.body.email,
    });

    if (checkuser) {
      return res.status(409).json({
        message: "User already exists. Please choose a different email.",
      });
    }

    let encryptedPassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString();

    req.body.role = "admin";
    req.body.verified = true;

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: encryptedPassword,
      role: req.body.role,
      verified: req.body.verified,
    });

    // saving as new user
    const savedUser = await newUser.save();
    // const { password, ...other } = savedUser._doc;
    res.status(201).json({
      message: "Admin created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
