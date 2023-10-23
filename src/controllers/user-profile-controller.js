const { transactionSchema } = require("../validators/transaction-validator");
const prisma = require("../models/prisma");
const constantStatus = require('../util/constant/status')
const constantCoin = require('../util/constant/coin')

// dash board
exports.get = async (req, res, next) => {
  try {

    const user_id = req.user.user_id
    console.log("user_id", user_id);

    const findPortfolioByUserId = await prisma.portfolio.findMany({
      where: {
        user_id: user_id
        }
    });

    res.status(201).json({ findPortfolioByUserId });
  } catch (err) {
    next(err);
  }
};

// show balance usd 
exports.getUsdtByUserId = async (req, res, next) => {
  try {
    // let request = req.body
    const user_id = req.user.user_id
    console.log("🚀 ~ file: user-profile-controller.js:29 ~ exports.getUsdtByUserId= ~ user_id:", user_id)

    const findPortfolioByUserId = await prisma.portfolio.findFirst({
      where: {
          AND: [{coin_name: constantCoin.USDT}, {user_id: user_id}] 
        }
    });
    res.status(201).json({ findPortfolioByUserId });
  }catch (err) {
    next(err);
  }
}

// show transaction history -------- USER
exports.getTransactionProfile = async (req, res, next) => {
  try {
    const user_id = req.user.user_id
    console.log("🚀 ~ file: user-profile-controller.js:44 ~ exports.getTransactionProfile= ~ user_id:", user_id)
    const findTransactionHistory = await prisma.transaction.findMany({
      where: {
        user_id: user_id
        }
    });
    

    res.status(201).json({ findTransactionHistory });
  } catch (err) {
    next(err);
  }
};

// show deposit history --------- USER
exports.getDepositProfile = async (req, res, next) => {
  try {
    const user_id = req.user.user_id
    const findDepositHistory = await prisma.history_payment.findMany({
      where: {
        user_id: user_id
        }
    });
    console.log("🚀 ~ file: user-profile-controller.js:70 ~ exports.getDepositProfile= ~ findDepositHistory:", findDepositHistory)

    

    res.status(201).json({ findDepositHistory });
  } catch (err) {
    next(err);
  }
};



