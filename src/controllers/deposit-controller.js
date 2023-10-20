const {
  depositSchema,
  topupSchema,
} = require("../validators/deposit-validator");
const prisma = require("../models/prisma");
const constantCoin = require('../util/constant/coin')

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

    if (error) {
      return next(error);
    }
    
    const user_id = req.user.user_id;
    console.log("🚀 ~ file: deposit-controller.js:44 ~ exports.topup= ~ user_id:", user_id)

    const bodyRequest = {
      amount: value?.amount,
      user_id: user_id
    }
    console.log("🚀 ~ file: deposit-controller.js:50 ~ exports.topup= ~ bodyRequest:", bodyRequest)

    await prisma.history_payment.create({
      data: bodyRequest
    })

    const findCoinListUSDT = await prisma.coin_list.findFirst({
      where: {
        coin_name: constantCoin.USDT
      }
    })
    console.log("🚀 ~ file: deposit-controller.js:59 ~ exports.topup= ~ findCoinListUSDT:", findCoinListUSDT)
    
    const newQuantity = parseFloat(findCoinListUSDT?.quantity) - parseFloat(value?.quantity)
  
    const s = await prisma.coin_list.update({
      where: {
        coin_list_id: findCoinListUSDT?.coin_list_id
      },
      data: {
        quantity: newQuantity
      }
    })


    // const findValueOld  = await prisma.coin_list.findUnique({
    //   where: {
    //     coin_list_id: 1
    //   },
    //   select: {
    //     quantity: true
    //   }
    // })
  
    // // old value
    // let oldQuantity  = findValueOld.quantity
    // // new value
    // let bodyQuantity = value?.quantity

    // let newQuantity = parseFloat(oldQuantity) + parseFloat(bodyQuantity)

    // value.quantity = newQuantity

    // const topupDeposit = await prisma.coin_list.update({
    //   data: value,
    //   where: {
    //     coin_list_id: 1,
    //   },
    // });
    console.log("topupDeposit ----------> ", s);
    res.status(201).json({ s });
  } catch (err) {
    next(err);
  }
};


exports.validate = async (req, res, next) => {
  try {
      let request = req.body;
      const user_id = req.user.user_id
      console.log("🚀 ~ file: deposit-controller.js:108 ~ exports.validate= ~ user_id:", user_id)
      const findHistoryPayment = await prisma.history_payment.findFirst({
          where: {
              user_id: request?.user_id
          }
      });

      let validate;

      if (!findHistoryPayment) {
          validate = false
      }else{
          validate = true
      }

      const response = {
          status: constantStatus.SUCCEDD,
          validate: validate
      }       
      console.log("validate: --------> ", response);
      res.status(201).json({ response });
  } catch (err) {
      next(err);
  }
}