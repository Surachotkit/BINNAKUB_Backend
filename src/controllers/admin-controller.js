const fs = require("fs/promises");
const prisma = require("../models/prisma");
const { upload } = require("../util/cloudinary/cloudinary-service");


exports.uploadLogoCoin = async (req, res, next) => {

  try {
    console.log("req.file", req.file);
    console.log(req.body.message)
    const data = req.body.message
    console.log(data)
    const obj = JSON.parse(data)
    console.log("🚀 ~ file: admin-controller.js:12 ~ exports.uploadLogoCoin= ~ obj:", obj)
    

    if (req.file) {
      const url = await upload(req.file.path);
      const addPhoto = await prisma.coin_list.create({
        data: {
          image_coin: url,
          coin_name : obj.coin_name,
          quantity: obj.quantity ,
        },
      });
      console.log("🚀 ~ file: admin-controller.js:22 ~ exports.uploadLogoCoin= ~ addPhoto:",addPhoto )
    }

    res.status(201).json({msg:"addPhoto"});
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};
