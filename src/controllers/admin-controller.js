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
    console.log("🚀 ~ file: admin-controller.js:82 ~ exports.addCoinInMarket= ~ value:", value)
    console.log("🚀 ~ file: admin-controller.js:49 ~ exports.addQuantity= ~ value:", value.coin_name)
    console.log("🚀 ~ file: admin-controller.js:49 ~ exports.addQuantity= ~ value:", value.coin_list_id)
   

    if (error) {
      return next(error);
    }
    const body = {
      coin_list_id: value?.coin_list_id,
      coin_name: value?.coin_name
    }
    console.log("🚀 ~ file: admin-controller.js:91 ~ exports.addCoinInMarket= ~ body:", body)

    const findCoinInActive = await prisma.coin_list.findFirst({
      where: body
    });
    console.log("🚀 ~ file: admin-controller.js:96 ~ exports.addCoinInMarket= ~ findCoinInActive:", findCoinInActive)

    await prisma.coin_list.update({
      data: { status: "Active"},
      where: {
        coin_list_id: findCoinInActive?.coin_list_id
       
      }
    })
    
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
        coin_list_id: del?.coin_list_id,
      },
    });
    // console.log("🚀 ~ file: admin-controller.js:142 ~ exports.deleteCoin ~ test:", test)

    res.status(200).json({ message: "deleted" });
  } catch (err) {
    next(err);
  }
};


// show transaction history -------- Admin
exports.getTransactionProfileAdmin = async (req, res, next) => {
  try {
    
    const findTransactionHistory = await prisma.transaction.findMany({
      select: {
        transaction_id: true,
        coin_name: true,
        quantity: true,
        type: true,
        price: true,
        fee: true,
        user_id: true,
      }
    });
    
    res.status(201).json({ findTransactionHistory });
  } catch (err) {
    next(err);
  }
};

// show deposit history -------- Admin
exports.getDepositProfileAdmin = async (req, res, next) => {
  try {
    
    const findDepositHistory = await prisma.history_payment.findMany({
      select: {
        history_payment_id: true,
        amount: true,
        user_id: true,
      }
    });
    console.log("🚀 ~ file: admin-controller.js:157 ~ exports.getTransactionProfileAdmin= ~ findPortfolioByUserId:", findDepositHistory)
    

    res.status(201).json({ findDepositHistory });
  } catch (err) {
    next(err);
  }
};