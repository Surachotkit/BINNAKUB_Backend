const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{8,30}$/)
    .trim()
    .required()
    ,
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .trim()
    .required()
    .strip(),
});

exports.registerSchema = registerSchema;

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

exports.loginSchema = loginSchema;
