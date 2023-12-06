const {
  depositSchema,
  topupSchema,
} = require("../validators/deposit-validator");
const prisma = require("../models/prisma");
const constantCoin = require('../util/constant/coin')
const constantStatus = require("../util/constant/status")
const constantFee = require("../util/constant/fee")

// fisrt time
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
    // deposit
    const createHistoryPayment = await prisma.history_payment.create({
      data: bodyRequest,
    });
    // update coin list
    const findCoinListUSDT = await prisma.coin_list.findFirst({
      where: {
          coin_name: constantCoin.USDT
      }
    });
    // valueOld - valueNewUser 
    const newAmountUpdateInTableCoinList = parseFloat(findCoinListUSDT?.quantity) - parseFloat(value?.amount);
    await prisma.coin_list.update({
      where: {
          coin_list_id: findCoinListUSDT?.coin_list_id
      },
      data: {
          quantity: newAmountUpdateInTableCoinList
      }
    });
    // create transaction
    const Fee = constantFee?.FEE
    const fee = (parseFloat(value?.amount) * parseFloat(Fee))
    let bodyTransaction = {
        coin_name: constantCoin.USDT,
        type: constantStatus.BUY,
        price: value?.amount,
        quantity: value?.amount,
        fee: fee,
        user_id: user_id,
        status: constantStatus?.ACTIVE
    }
    
    await prisma.transaction.create({
        data: bodyTransaction,
    });

    let bodyNewCoinInPortfolio = {
        coin_name: constantCoin.USDT,
        average_purchase_price: 0.00,
        quantity: value?.amount,
        profit_or_loss: 0.00,
        weight: 0,
        user_id: user_id
    }
    // create portfolio
    await prisma.portfolio.create({
        data: bodyNewCoinInPortfolio,
    });

    let response = {
        status: constantStatus.SUCCEDD,
        data: createHistoryPayment
    }

    console.log("createHistoryPayment: --------> ", createHistoryPayment);
    res.status(201).json({ response });
  } catch (err) {
    next(err);
  }
};



// next time
exports.topup = async (req, res, next) => {
  try {
    const { value, error } = depositSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    
    const user_id = req.user.user_id;

    const bodyRequest = {
      amount: value?.amount,
      user_id: user_id
    }
    // deposit
    const createHistoryPayment = await prisma.history_payment.create({
      data: bodyRequest
    })
    // update coinlist
    const findCoinListUSDT = await prisma.coin_list.findFirst({
      where: {
          coin_name: constantCoin.USDT
        }
    });
    
    const newAmountUpdateInTableCoinList = parseFloat(findCoinListUSDT?.quantity) - parseFloat(value?.amount);
        await prisma.coin_list.update({
            where: {
                coin_list_id: findCoinListUSDT?.coin_list_id
            },
            data: {
                quantity: newAmountUpdateInTableCoinList
            }
        });

        // create transaction
        const Fee = constantFee?.FEE
        const fee = (parseFloat(value?.amount) * parseFloat(Fee)) 
        let bodyTransaction = {
            coin_name: constantCoin.USDT,
            type: constantStatus.BUY,
            price: value?.amount,
            quantity: value?.amount,
            fee: fee,
            user_id: user_id,
            status: constantStatus?.ACTIVE
        }
        await prisma.transaction.create({
            data: bodyTransaction,
        });
        // update portfolio
        const findOldUsdtInPortfolio = await prisma.portfolio.findFirst({
            where: {
                AND: [{coin_name: constantCoin.USDT}, {user_id: user_id}] 
            }
        })
        
        const newAmount = parseFloat(findOldUsdtInPortfolio?.quantity) + parseFloat(value?.amount);
  
        await prisma.portfolio.update({
            data: {
                weight: 0,
                average_purchase_price: 0,
                profit_or_loss: 0,
                quantity: newAmount,
            },
            where: {
                portfolio_id: findOldUsdtInPortfolio?.portfolio_id,
                AND: [
                    { user_id: user_id },
                    { coin_name: constantCoin.USDT }
                ]
            }
        });

        let response = {
          status: constantStatus.SUCCEDD,
          data: createHistoryPayment
        }

        res.status(201).json({ response });
  } catch (err) {
    next(err);
  }
};


exports.validate = async (req, res, next) => {
  try {
      let request = req.body;
      const findHistoryPayment = await prisma.history_payment.findFirst({
          where: {
              user_id: request?.user_id
          }
      });

      let validate;
      // ถ้าไม่มี ให้ create
      if (!findHistoryPayment) {
          validate = false
      // ถ้ามี ให้ update
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