const { depositSchema } = require("../validators/deposit-validator");
const prisma = require("../models/prisma");

exports.create = async (req, res, next) => {
  try {
    const { value, error } = depositSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    //get username from Auth
    const user_id = req.user.user_id
    console.log("user_id",user_id);
    
    let bodyRequest = {
      amount: value?.amount,
      user_id: user_id
    };

    const createHistoryPayment = await prisma.history_payment.create({
      data: bodyRequest
    });

    console.log("createHistoryPayment: --------> ", createHistoryPayment);
    res.status(201).json({ createHistoryPayment });
  } catch (err) {
    next(err);
  }
};
