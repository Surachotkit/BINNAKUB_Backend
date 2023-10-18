const {
  depositSchema,
  topupSchema,
} = require("../validators/deposit-validator");
const prisma = require("../models/prisma");

exports.create = async (req, res, next) => {
  try {
    const { value, error } = depositSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    //get username from Auth
    const user_id = req.user.user_id;
    console.log("user_id", user_id);

    let bodyRequest = {
      amount: value?.amount,
      user_id: user_id,
    };

    const createHistoryPayment = await prisma.history_payment.create({
      data: bodyRequest,
    });

    console.log("createHistoryPayment: --------> ", createHistoryPayment);
    res.status(201).json({ createHistoryPayment });
  } catch (err) {
    next(err);
  }
};

exports.topup = async (req, res, next) => {
  try {
    const { value, error } = topupSchema.validate(req.body);
    console.log(
      "🚀 ~ file: deposit-controller.js:34 ~ exports.topup= ~ value:",
      value
    );

    if (error) {
      return next(error);
    }
    const findValueOld  = await prisma.coin_list.findUnique({
      where: {
        coin_list_id: 1
      },
      select: {
        quantity: true
      }
    })
    console.log("🚀 ~ file: deposit-controller.js:50 ~ exports.topup= ~ findValueOld:", findValueOld)
    // old value
    let oldQuantity  = findValueOld.quantity
    console.log("🚀 ~ file: deposit-controller.js:55 ~ exports.topup= ~ oldQuantity:", oldQuantity)
  
    // new value
    let bodyQuantity = value?.quantity
    console.log("🚀 ~ file: deposit-controller.js:68 ~ exports.topup= ~ bodyQuantity:", bodyQuantity)
    let newQuantity = parseFloat(oldQuantity) + parseFloat(bodyQuantity)
    console.log("🚀 ~ file: deposit-controller.js:71 ~ exports.topup= ~ newQuantity:", newQuantity)
    
    value.quantity = newQuantity

    const topupDeposit = await prisma.coin_list.update({
      data: value,
      where: {
        coin_list_id: 1,
      },
    });
    console.log("topupDeposit ----------> ", topupDeposit);
    res.status(201).json({ topupDeposit });
  } catch (err) {
    next(err);
  }
};
