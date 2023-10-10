const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require("../validators/auth-validator");
const prisma = require("../models/prisma");
const createError = require("../util/create-error");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    console.log(value);

    if (error) {
      return next(error);
    }
    value.password = await bcrypt.hash(value.password, 12);
    const user = await prisma.user.create({
      data: value,
    });
    // console.log(user.user_id)

    const payload = { userId: user.user_id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "1q1w1w1we22e2ee2r33r",
      { expiresIn: process.env.JWT_EXPIRE }
    );
    

    delete user.password
    res.status(201).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    
  } catch (err) {
    next(err);
  }
};
