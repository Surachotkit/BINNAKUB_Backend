const fs = require("fs/promises");
const prisma = require("../models/prisma");
const { upload } = require("../util/cloudinary/cloudinary-service");
const { deleteSchema,addCoinSchema,addQuantitySchema } = require("../validators/admin-validator");

const createError = require("../util/create-error");

exports.uploadLogoCoin = async (req, res, next) => {
  try {
    // console.log("req.file", req.file);
    // console.log(req.body.message);
    const data = req.body.message;
    // console.log(data);
    const obj = JSON.parse(data);
    // console.log(
    //   "🚀 ~ file: admin-controller.js:12 ~ exports.uploadLogoCoin= ~ obj:",
    //   obj
    // );

    if (req.file) {
      const url = await upload(req.file.path);
      const addPhoto = await prisma.coin_list.create({
        data: {
          image_coin: url,
          coin_name: obj.coin_name,
          quantity: obj.quantity,
        },
      });
      // console.log(
      //   "🚀 ~ file: admin-controller.js:22 ~ exports.uploadLogoCoin= ~ addPhoto:",
      //   addPhoto
      // );
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


exports.addQuantity = async (req, res, next) => {
  try {
    const { value, error } = addQuantitySchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const findCoinOld = await prisma.coin_list.findFirst({
      where: {
        coin_list_id: value?.coin_list_id,
        coin_name: value?.coin_name
      },
    });

    const newQuantityUpdate =
    parseFloat(findCoinOld?.quantity) + parseFloat(value?.quantity);
    await prisma.coin_list.update({
      where: {
        coin_list_id: findCoinOld?.coin_list_id,
      },
      data: {
        quantity: newQuantityUpdate,
      },
    });


    res.status(200).json({ message: "addQuantity success" });
  } catch (err) {
    console.log(err);
  }
};

exports.addCoinInMarket = async (req,res,next) => {
  try{
    const { value, error } = addCoinSchema.validate(req.body);
    // console.log("🚀 ~ file: admin-controller.js:49 ~ exports.addQuantity= ~ value:", value)

    if (error) {
      return next(error);
    }

    const update = await prisma.coin_list.update({
      data: value?.coin_name,
      where: {
        coin_name: value?.coin_name,
        status: "Active"
      }
    })
    // console.log("🚀 ~ file: admin-controller.js:101 ~ exports.addCoinInMarket= ~ update:", update)
    


    res.status(200).json({ message: "addCoin success" });
  }catch(err){
    next(err)
  }
}

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
