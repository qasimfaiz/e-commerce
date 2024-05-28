const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Get the access token from the cookie
  const token = req.cookies.token;
  // If there is no token, return an unauthorized error
  if (!token) {
    return res
      .status(401)
      .json(
        "You need to log in to access this page. Please login or sign up to continue."
      );
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    // Handle token expiration
    if (error.message === "jwt expired") {
      // Handle token expiration error
      handleTokenExpiration(req, res, next, token);
    } else {
      // Handle other token verification errors
      return res
        .status(401)
        .json(
          "You need to log in to access this page. Please login or sign up to continue."
        );
    }
  }
};

const handleTokenExpiration = (req, res, next, expiredToken) => {
  const user = jwt.decode(expiredToken);

  // Check if the expired token has truly expired
  if (Date.now() >= user.exp * 1000) {
    // Issue a new access token
    const newToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // New expiration time for the token
      }
    );

    // Set the new token as a cookie
    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : "none", // Set secure to true if using HTTPS,
      sameSite: "none",
      maxAge: 2 * 24 * 60 * 60 * 1000, // valid for 2 Day
    });
    req.user = user;
    next();
  }
};

//THIS WILL VERIFY TOKEN AND ALSO CHECK IF USER IS HIMSELF BY USING TOKEN OR IT IS AN ADMIN
const verifyTokenAndAuthorization = (req, res, next) => {
  //First it will verify token and next it will execute call back function and then next ()
  verifyToken(req, res, () => {
    if (
      req.user.id === req.params.id ||
      req.user.role === "admin" ||
      req.user.role === "super admin"
    ) {
      next();
    } else {
      res
        .status(403)
        .json("Insufficient privileges. Contact administrator for assistance.");
    }
  });
};

//THIS WILL VERIFY IT IS AN ADMIN OR NOT
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin" || req.user.role == "super admin") {
      next();
    } else {
      res
        .status(403)
        .json("Insufficient privileges. Contact administrator for assistance.");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
