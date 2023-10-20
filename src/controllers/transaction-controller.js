const { transactionSchema } = require("../validators/transaction-validator");
const prisma = require("../models/prisma");
const constantStatus = require('../util/constant/status')

exports.create = async (req, res, next) => {
  try {
    const { value, error } = transactionSchema.validate(req.body);
    console.log("🚀 ~ file: transaction-controller.js:8 ~ exports.create= ~ value:", value)

    if (error) {
      return next(error);
    }

    const user_id = req.user.user_id;
    console.log("user_id", user_id);

    let bodyRequest = {
      coin_name: value?.coin_name,
      type: value?.type,
      price: value?.price,
      quantity: value?.quantity,
      fee: value?.fee,
      user_id: value?.user_id,
      status: constantStatus?.ACTIVE
    };

    const createTransaction = await prisma.transaction.create({
      data: bodyRequest,
    });

    console.log("createTransaction ----------> ", createTransaction);
    res.status(201).json({ createTransaction });
  } catch (err) {
    next(err);
  }
};

