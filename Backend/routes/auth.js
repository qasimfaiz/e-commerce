const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {
  loginSchema,
  registrationSchema,
  resetSchema,
} = require("../validations/userValidation");
const { verifyTokenAndAdmin } = require("./verifyToken");
//REGISTER USER
router.post("/register", async (req, res) => {
  const { error } = registrationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //Checking if user exsist in database
  const newRegister = await User.findOne({
    email: req.body.email,
  });

  if (newRegister) {
    return res.status(409).json({
      message: "User already exists. Please choose a different email.",
    });
  }

  let encryptedPassword = CryptoJS.AES.encrypt(
    req.body.password,
    process.env.PASS_SECRET
  ).toString();

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: encryptedPassword,
  });

  try {
    // saving as new user
    const savedUser = await newUser.save();
    // const { password, ...other } = savedUser._doc;
    res.status(201).json({
      message: "Registered Successful, You will be redirected to login page ",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Login USER

router.post("/login", async (req, res) => {
  // Validate the request body
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    //Checking if user exsist in database
    const loginUser = await User.findOne({
      email: req.body.email,
    });

    if (!loginUser) {
      return res.status(401).json({
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    // Check if user is active
    if (loginUser.status !== "active") {
      return res.status(401).json({
        message:
          "Your account is currently suspended. Please contact support for further assistance.",
      });
    }
    //check if user is verified
    if (!loginUser.verified) {
      return res
        .status(401)
        .json({ message: "Please verify your email to continue." });
    }

    //Decrypting Password to compare with req.body.password
    const decrypted = CryptoJS.AES.decrypt(
      loginUser.password,
      process.env.PASS_SECRET
    );
    // converting to string
    const decryptedPass = decrypted.toString(CryptoJS.enc.Utf8);
    if (decryptedPass != req.body.password) {
      return res.status(401).json({
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    // when user will be logged, then token generate
    const accessToken = jwt.sign(
      {
        id: loginUser._id,
        role: loginUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password, ...other } = loginUser._doc;
    // Set the JWT as an HTTP-only cookie
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : "none",
      sameSite: "None", // Allow cross-origin requests for the cookie
      maxAge: 1 * 24 * 60 * 60 * 1000, // valid for 1 Day
    });

    res
      .status(201)
      .json({ ...other, message: "You are successfully logged in" }); //201 for successfully edit
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// logout

router.get("/logout", (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : "none",
      sameSite: "None", // Allow cross-origin requests for the cookie
      expires: new Date(0), // Set an expiration date in the past
    });
    res.json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route handler for POST /auth/reset-password
router.post("/reset-password", async (req, res) => {
  const { error } = resetSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const email = req.body.email;

  try {
    // Check if the email exists in the
    //Checking if user exsist in database
    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({
        message:
          "User does not exist. Please check your credentials or sign up for a new account.",
      });
    }

    //check if user is verified

    if (!user.verified) {
      return res
        .status(401)
        .json({ message: "Please verify your email to continue." });
    }

    //Decrypting Password to compare with req.body.password
    const decrypted = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET
    );
    // converting to string
    const decryptedPass = decrypted.toString(CryptoJS.enc.Utf8);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL, // your Gmail address
        pass: process.env.PASSWORD, // your Gmail password or app password
      },
    });

    const mailOptions = {
      from: `"ShopSwift-fyp" <${process.env.EMAIL}>`, // sender address
      to: email, // Recipient email address
      subject: "Password Retrieve",
      html: `
        <h2>Retrieved Password:</h2>
        <p>Dear customer your password is: ${decryptedPass}</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending email" });
      }
      console.log("Email sent: " + info.response);
      res.status(200).json({
        message:
          "Your password has been sent to your email. Please check your inbox or spam folder.",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// admin login

router.post("/admin-login", async (req, res) => {
  // Validate the request body
  const { error } = loginSchema.validate({
    email: req.body.email,
    password: req.body.password,
  });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    //Checking if user exsist in database
    const loginUser = await User.findOne({
      email: req.body.email,
    });

    if (!loginUser) {
      return res.status(401).json({
        message: "Invalid credentials. Please check your email and password.",
      });
    }
    // Check if user is active
    if (loginUser.status !== "active") {
      return res.status(401).json({
        message:
          "Your account is currently suspended. Please contact support for further assistance.",
      });
    }

    //check if user is verified

    if (!loginUser.verified) {
      return res
        .status(401)
        .json({ message: "Please verify your email to continue." });
    }

    // Check if user is admin
    if (loginUser.role !== "admin" && loginUser.role !== "super admin") {
      return res.status(401).json({
        message:
          "Insufficient privileges. Contact administrator for assistance.",
      });
    }

    //Decrypting Password to compare with req.body.password
    const decrypted = CryptoJS.AES.decrypt(
      loginUser.password,
      process.env.PASS_SECRET
    );
    // converting to string
    const decryptedPass = decrypted.toString(CryptoJS.enc.Utf8);
    if (decryptedPass != req.body.password) {
      return res.status(401).json({
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    // when user will be logged, then token generate
    const accessToken = jwt.sign(
      {
        id: loginUser._id,
        role: loginUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password, ...other } = loginUser._doc;
    // Set the JWT as an HTTP-only cookie
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : "none",
      sameSite: "None", // Allow cross-origin requests for the cookie
      maxAge: 1 * 24 * 60 * 60 * 1000, // valid for 1 Day
    });
    // console.log("admin login", other);
    res
      .status(201)
      .json({ ...other, message: "You are successfully logged in" }); //201 for successfully edit
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/adminLoginStatus", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(200).json(false);
    }

    res.status(200).json(true);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
