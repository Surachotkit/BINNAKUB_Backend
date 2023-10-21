const fs = require("fs/promises");
const prisma = require("../models/prisma");
const { upload } = require("../util/cloudinary/cloudinary-service");
const { addQuantitySchema } = require("../validators/admin-validator");
const { deleteSchema } = require("../validators/admin-validator");
const createError = require("../util/create-error");

exports.uploadLogoCoin = async (req, res, next) => {
  try {
    console.log("req.file", req.file);
    console.log(req.body.message);
    const data = req.body.message;
    console.log(data);
    const obj = JSON.parse(data);
    console.log(
      "🚀 ~ file: admin-controller.js:12 ~ exports.uploadLogoCoin= ~ obj:",
      obj
    );

    if (req.file) {
      const url = await upload(req.file.path);
      const addPhoto = await prisma.coin_list.create({
        data: {
          image_coin: url,
          coin_name: obj.coin_name,
          quantity: obj.quantity,
        },
      });
      console.log(
        "🚀 ~ file: admin-controller.js:22 ~ exports.uploadLogoCoin= ~ addPhoto:",
        addPhoto
      );
    }

    res.status(201).json({ msg: "addPhoto" });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

//not finish
exports.addQuantity = async (req, res, next) => {
  try {
    const { value, error } = addQuantitySchema.validate(req.body);

    if (error) {
      return next(error);
    }

    // const bodyRequest = {
    //   quantity: value?.quantity,
    // };

    // const createHistoryPayment = await prisma.history_payment.create({
    //   data: bodyRequest,
    // });

    const findCoinListUSDT = await prisma.coin_list.findFirst({
      where: {
        coin_name: constantCoin.USDT,
      },
    });

    const newAmountUpdateInTableCoinList =
      parseFloat(findCoinListUSDT?.quantity) - parseFloat(value?.amount);
    await prisma.coin_list.update({
      where: {
        coin_list_id: findCoinListUSDT?.coin_list_id,
      },
      data: {
        quantity: newAmountUpdateInTableCoinList,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteCoin = async (req, res, next) => {
  try {
    const { value, error } = deleteSchema.validate(req.params);
    console.log(
      "🚀 ~ file: admin-controller.js:81 ~ exports.deleteCoin ~ value:",
      value
    );
    if (error) {
      return next(error);
    }

    const del = await prisma.coin_list.findFirst({
      where: {
        coin_list_id: value?.coin_list_id,
      },
    });
    console.log(
      "🚀 ~ file: admin-controller.js:91 ~ exports.deleteCoin ~ del:",
      del
    );

    if (!del) {
      return next(createError("cannot delete this", 400));
    }

    await prisma.coin_list.delete({
      where: {
        coin_list_id: del.coin_list_id,
      },
    });

    res.status(200).json({ message: "deleted" });
  } catch (err) {
    next(err);
  }
};
