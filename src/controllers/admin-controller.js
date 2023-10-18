const fs = require("fs/promises");
const prisma = require("../models/prisma");
const { upload } = require("../util/cloudinary/cloudinary-service");
exports.uploadLogoCoin = async (req, res, next) => {
  const { coin_name, price, quantity, fee, type_coin, status } = req.body;
  try {
    console.log("req.file", req.file);

    if (req.file) {
      const url = await upload(req.file.path);
      await prisma.coin_list.create({
        data: {
          image_coin: url,
          coin_name,
          price,
          quantity,
          type_coin,
          status,
          fee:0.01
        },
      });
    }

    res.status(201).json({ message: "created" });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};
