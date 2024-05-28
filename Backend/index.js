require("dotenv").config(); // requiring dotenv config to use .env file variables
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const stripeRouter = require("./routes/stripe");
const contactRouter = require("./routes/contact");
var cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const app = express();

let ClientURL = process.env.CLIENT_URL;
let AdminURL = process.env.ADMIN_URL;

// Set Security HTTP headers
app.use(helmet());

//Body parser middleware
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Cookie Parser
app.use(cookieParser());

allowedOrigins = [
  ClientURL,
  AdminURL,
  "http://localhost:3000",
  "http://localhost:3001",
];
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", *);
//   next();
// });
const corsOptions = {
  origin: allowedOrigins,
  credentials: true, // Enable CORS credentials
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Define allowed HTTP methods
};

app.use(cors(corsOptions));

//Limit Request from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "To many request, try again later in an hour", //Window Mili-sec
// });
// app.use("/api", limiter);

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//connection to database
const mongoString = process.env.DATABASE_URL;
mongoose
  .connect(mongoString)
  .then(() => console.log("Database Connected"))
  .catch((error) => console.log(error));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter); // getting user detail
app.use("/api/users", adminRouter); // getting admin details
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/checkout", stripeRouter);
app.use("/api/contact", contactRouter);

app.listen(process.env.PORT || 5001, () => {
  console.log(`Server Started at ${process.env.PORT}`);
});
