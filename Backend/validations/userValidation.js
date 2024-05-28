const Joi = require("joi");

// Password validation pattern
const passwordPattern =
  /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()\-_=+{}[\]:;"'<>,.?|\\/~`]+$/;

// Registration schema
const registrationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Username is required.",
    "string.min": "Username must be at least 3 characters long.",
    "string.max": "Username cannot exceed 30 characters.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Email must be a valid email address.",
  }),
  password: Joi.string()
    .trim()
    .custom((value, helpers) => {
      if (/\s/.test(value)) {
        return helpers.message("New password must not contain spaces.");
      }
      return value;
    })
    .custom((value, helpers) => {
      const passwordLength = value.length;
      if (passwordLength < 8) {
        return helpers.message(
          "New password must be at least 8 characters long."
        );
      }
      if (passwordLength > 30) {
        return helpers.message("New password cannot exceed 30 characters.");
      }
      return value;
    })
    .pattern(passwordPattern)
    .required()
    .messages({
      "string.empty": "New password is required.",
      "string.pattern.base":
        "New password must contain at least one lowercase letter, one uppercase letter, and one digit.",
    }),
});

// Login schema
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Email must be a valid email address.",
  }),
  password: Joi.string()
    // .pattern(passwordPattern)
    // .min(8)
    // .max(30)
    .required()
    .messages({
      "string.empty": "Password is required.",
      //   "string.min": "Password must be at least 8 characters long.",
      //   "string.max": "Password cannot exceed 30 characters.",
      //   "string.pattern.base":
      //     "Password must contain at least one lowercase letter, one uppercase letter, and one digit.",
    }),
});

// Password reset schema
const resetSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Email must be a valid email address.",
  }),
});

const ChangePasswordSchema = Joi.object({
  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
  }),
  newPassword: Joi.string()
    .trim()
    .invalid(Joi.ref("password"))
    .custom((value, helpers) => {
      if (/\s/.test(value)) {
        return helpers.message("New password must not contain spaces.");
      }
      return value;
    })
    .custom((value, helpers) => {
      const passwordLength = value.length;
      if (passwordLength < 8) {
        return helpers.message(
          "New password must be at least 8 characters long."
        );
      }
      if (passwordLength > 30) {
        return helpers.message("New password cannot exceed 30 characters.");
      }
      return value;
    })
    .pattern(passwordPattern)
    .required()
    .messages({
      "string.empty": "New password is required.",
      "any.invalid":
        "New password must be different from the current password.",
      "string.pattern.base":
        "New password must contain at least one lowercase letter, one uppercase letter, and one digit.",
    }),
});

// UpdateAdminProfileScheme
const UpdateProfileScheme = Joi.object({
  username: Joi.string().min(3).max(30).messages({
    "string.min": "Username must be at least 3 characters long.",
    "string.max": "Username cannot exceed 30 characters.",
  }),
  email: Joi.string().email().messages({
    "string.email": "Email must be a valid email address.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
  }),
});

// EditUserScheme
const EditUserScheme = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.min": "Username must be at least 3 characters long.",
    "string.max": "Username cannot exceed 30 characters.",
    "string.empty": "Username is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
  }),
});

module.exports = {
  registrationSchema,
  loginSchema,
  resetSchema,
  UpdateProfileScheme,
  ChangePasswordSchema,
  EditUserScheme,
};
