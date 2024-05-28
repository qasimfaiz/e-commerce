const Joi = require("joi");

const createProductSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required.",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required.",
  }),
  categories: Joi.array().min(1).required().messages({
    "array.min": "Categories must contain at least one category.",
    "any.required": "Categories is required.",
  }),
  price: Joi.custom((value, helpers) => {
    if (!value) {
      return helpers.error("any.empty");
    }
    if (isNaN(Number(value))) {
      return helpers.error("number.base");
    }
    return value;
  })
    .required()
    .messages({
      "any.empty": "Price is required.",
      "number.base": "Price must be a number.",
    }),
  image: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/png", "image/jpeg", "image/jpg")
      .required()
      .messages({
        "any.only": "Image must be of type png, jpeg, or jpg",
        "any.required": "Image is required.",
      }),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().required(),
  })
    .required()
    .messages({
      "object.missing": "Image is required.",
    }),
});

const updateProductSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required.",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required.",
  }),
  categories: Joi.array().min(1).required().messages({
    "array.min": "Categories must contain at least one category.",
    "any.required": "Categories is required.",
  }),
  price: Joi.custom((value, helpers) => {
    if (!value) {
      return helpers.error("any.empty");
    }
    if (isNaN(Number(value))) {
      return helpers.error("number.base");
    }
    return value;
  })
    .required()
    .messages({
      "any.empty": "Price is required.",
      "number.base": "Price must be a number.",
    }),
  image: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/png", "image/jpeg", "image/jpg")
      .required()
      .messages({
        "any.only": "Image must be of type png, jpeg, or jpg",
        "any.required": "Image is required.",
      }),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().required(),
  }).messages({
    "object.missing": "Image is required.",
  }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
