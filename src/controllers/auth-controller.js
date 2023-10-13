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
    console.log(value.password, "password");
    value.password = await bcrypt.hash(value.password, 12);
    const user = await prisma.user.create({
      data: value,
    });
    console.log("user", user);

    const payload = { userId: user.user_id };
    console.log("payload", payload);
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "1q1w1w1we22e2ee2r33r",
      { expiresIn: process.env.JWT_EXPIRE }
    );
    console.log("🚀 ~ file: auth-controller.js:29 ~ exports.register= ~ accessToken:", accessToken)
    

    delete user.password;
    res.status(201).json({ accessToken, user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    console.log("-------------");
    console.log(req.body);
    const { value, error } = loginSchema.validate(req.body);
    console.log("🚀 ~ file: auth-controller.js:44 ~ exports.login= ~ value:", value)

    if (error) {
      return next(error);
    }
    console.log("-------");

    const user = await prisma.user.findFirst({
      where: { email: value.email },
    });
    console.log("🚀 ~ file: auth-controller.js:54 ~ exports.login= ~ user:", user)

    if (!user) {
      return next(createError("invalid credential", 400));
    }

    const isMatch = await bcrypt.compare(value.password, user.password);
    console.log("🚀 ~ file: auth-controller.js:61 ~ exports.login= ~ isMatch:", isMatch)
    if (!isMatch) {
      return next(createError("invalid credential", 400));
    }

    const payload = { userId: user.user_id };
    console.log("🚀 ~ file: auth-controller.js:68 ~ exports.login= ~ payload:", payload)
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "1q1w1w1we22e2ee2r33r",
      { expiresIn: process.env.JWT_EXPIRE }
    );
    console.log("🚀 ~ file: auth-controller.js:73 ~ exports.login= ~ accessToken:", accessToken)

    delete user.password;
    res.status(200).json({ accessToken, user });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res, next) => {
  res.status(200).json({ user: req.user });
  
};
