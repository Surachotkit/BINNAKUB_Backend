const createError = require("../util/create-error");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");

module.exports = async (req, res, next) => {

  try {
    const authorization = req.headers.authorization;
    console.log("🚀 ~ file: authenticate.js:8 ~ module.exports= ~ authorization:", authorization)

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(createError("unauthenicated", 401));
    }

    const token = authorization.split(" ")[1];
    console.log("🚀 ~ file: authenticate.js:14 ~ module.exports= ~ token:", token)

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "1q1w1w1we22e2ee2r33r"
    );
    console.log("🚀 ~ file: authenticate.js:19 ~ module.exports= ~ payload:", payload)

    const user = await prisma.user.findUnique({
      where: {
        user_id: payload.userId,
      },
    });
    console.log("🚀 ~ file: authenticate.js:28 ~ module.exports= ~ user:", user)

    if (!user) {
      return next(createError("unauthenicated", 401));
    }
    delete user.password;

    req.user = user;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      err.statusCode = 401;
    }
    next(err);
  }
};
