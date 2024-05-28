const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: [true, "Please enter a username"] },
    email: {
      type: String,
      match: /.+\@.+\..+/,
      required: [true, "Please enter a email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    verified: {
      type: Boolean,
      default: true,
    },
    image: {
      profilePic: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
  },
  { timestamps: true }
);
// Pre-save hook to trim email value
userSchema.pre("save", function (next) {
  this.email = this.email.trim(); // Trim leading and trailing spaces

  next();
});

module.exports = mongoose.model("User", userSchema);
