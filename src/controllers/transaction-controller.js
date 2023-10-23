const { transactionSchema } = require("../validators/transaction-validator");
const prisma = require("../models/prisma");
const constantFee = require("../util/constant/fee")
const constantStatus = require("../util/constant/status")
const constantCoin = require("../util/constant/coin")



exports.create = async (req, res, next) => {

    try {
        // get request body from front-end
        const { value, error } = transactionSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const Fee = constantFee?.FEE

        // cal Fee = (price * quantity) * 0.01
        const fee = calculateFee(Fee, value?.quantity, value?.price)

        // setUp body for table: transaction 
        let bodyRequest = {
            coin_name: value?.coin_name,
            type: value?.type,
            price: value?.price,
            quantity: value?.quantity,
            fee: fee > 0 ? fee : 0,
            user_id: value?.user_id,
            status: constantStatus?.ACTIVE
        }

        // create transaction by bodyRequest
        const createTransaction = await prisma.transaction.create({
            data: bodyRequest,
        });

  
        // update stock fron coin_list ---> find coin_name = BTC in Table: coin_list
        const findCoinList = await prisma.coin_list.findFirst({
          where: {
              coin_name: value?.coin_name
            }
        });

        // new calculate for update in coint_list
        const newAmountUpdateInTableCoinList = parseFloat(findCoinList?.quantity) - parseFloat(value?.quantity);
        await prisma.coin_list.update({
          where: {
              coin_list_id: findCoinList?.coin_list_id
          },
            data: {
                quantity: newAmountUpdateInTableCoinList
            }
        });

        // update USDT in my portfolio , transaction , coin_list ----> ( User )
        const findUsdtInMyPortfolio = await prisma.portfolio.findFirst({
          where: {
              AND: [{coin_name: constantCoin.USDT},{user_id: value?.user_id}]
            }
        })
        // last amount USDT in my portfolio ?
        const updateUsdtInMyPortfolio = parseFloat(findUsdtInMyPortfolio?.quantity) - parseFloat(value?.amountUsdt)
        await prisma.portfolio.update({
          data: {
            quantity: updateUsdtInMyPortfolio
          },
          where: {
            portfolio_id: findUsdtInMyPortfolio?.portfolio_id,
          }
        });

        // create sell transaction USDT ----> ( USER )
        let bodySellUsdtInTransaction = {
          coin_name: constantCoin.USDT,
          type: constantStatus.SELL,
          price: value?.amountUsdt,
          quantity: value?.amountUsdt,
          fee: 0,
          user_id: value?.user_id,
          status: constantStatus?.ACTIVE
        }
        // create Sell USDT in Table transaction by user
        await prisma.transaction.create({
          data: bodySellUsdtInTransaction,
        });

        // Admin Get more USDT from user
        const findCoinListUsdt = await prisma.coin_list.findFirst({
          where: {
              coin_name: constantCoin.USDT
            }
        });

        const updateCoinListUsdt = parseFloat(findCoinListUsdt?.quantity) + parseFloat(value?.amountUsdt)
        await prisma.coin_list.update({
          where: {
              coin_list_id: findCoinListUsdt?.coin_list_id
          },
            data: {
                quantity: updateCoinListUsdt
            }
        });
        
        // find coin from portfolio
        const checkCoinListRelationship = await prisma.portfolio.findFirst({
            where: {
                AND: [{coin_name: value?.coin_name},{user_id: value?.user_id}]
            }
        })

        if(checkCoinListRelationship === null){
            // set up budy
            let bodyNewCoinInPortfolio = {
                coin_name: value?.coin_name,
                average_purchase_price: 0,
                quantity: value?.quantity,
                profit_or_loss: 0,
                weight: 0,
                user_id: value?.user_id
            }

            const createNewCoinInPortfolio = await prisma.portfolio.create({
                data: bodyNewCoinInPortfolio,
            });
            console.log("createNewCoinInPortfolio: --------> ", createNewCoinInPortfolio);
        }

        // set up response
        const response = {
          status: constantStatus.SUCCEDD,
          createTransaction: createTransaction
        }    
        console.log("createTransaction: --------> ", createTransaction);
        res.status(201).json({ response });
    }catch (err) {
        next(err);
    }
}



exports.update = async (req, res, next) => {

  try {
      
      const { value, error } = transactionSchema.validate(req.body);
      if (error) {
          return next(error);
      }
      const Fee = constantFee?.FEE

      const fee = calculateFee(Fee, value?.quantity, value?.price)

      //set body transaction ( USER )
      let bodyRequest = {
          coin_name: value?.coin_name,
          type: value?.type,
          price: value?.price,
          quantity: value?.quantity,
          fee: fee > 0 ? fee : value?.fee,
          user_id: value?.user_id,
          status: constantStatus?.ACTIVE
      }
      // create transaction ( USER )
      const updateTransaction = await prisma.transaction.create({
          data: bodyRequest,
      });

  

      if(value?.type === constantStatus.BUY){
          // update stock fron coin_list ( ADMIN )
          const findCoinList = await prisma.coin_list.findFirst({
            where: {
                coin_name: value?.coin_name
              }
          });

          // update new Amount In Table CoinList ( ADMIN )
          const newAmountUpdateInTableCoinList = parseFloat(findCoinList?.quantity) - parseFloat(value?.quantity);
          await prisma.coin_list.update({
            where: {
                coin_list_id: findCoinList?.coin_list_id
            },
              data: {
                  quantity: newAmountUpdateInTableCoinList
              }
          });

          // update USDT in my portfolio , transaction , coin_list ----> ( USER )
          const findUsdtInMyPortfolio = await prisma.portfolio.findFirst({
            where: {
                AND: [{coin_name: constantCoin.USDT},{user_id: value?.user_id}]
              }
          })
        
          // Case user buy BTC and Sell USDT ---> ( USER )
          const updateUsdtInMyPortfolio = parseFloat(findUsdtInMyPortfolio?.quantity) - parseFloat(value?.amountUsdt)
          await prisma.portfolio.update({
            data: {
              quantity: updateUsdtInMyPortfolio
            },
            where: {
              portfolio_id: findUsdtInMyPortfolio?.portfolio_id,
            }
          });


        // create sell transaction USDT ---> ( USER )
        let bodySellUsdtInTransaction = {
          coin_name: constantCoin.USDT,
          type: constantStatus.SELL,
          price: value?.amountUsdt,
          quantity: value?.amountUsdt,
          fee: 0,
          user_id: value?.user_id,
          status: constantStatus?.ACTIVE
        }

        await prisma.transaction.create({
          data: bodySellUsdtInTransaction,
        });

        // Find USDT from coin_list ----> ( ADMIN )
        const findCoinListUsdt = await prisma.coin_list.findFirst({
          where: {
              coin_name: constantCoin.USDT
            }
        });

        const updateCoinListUsdt = parseFloat(findCoinListUsdt?.quantity) + parseFloat(value?.amountUsdt)
        await prisma.coin_list.update({
          where: {
              coin_list_id: findCoinListUsdt?.coin_list_id
          },
            data: {
                quantity: updateCoinListUsdt
            }
        });
        // END BUY TRANSACTION

      }else if(value?.type === constantStatus.SELL){

        // update stock fron coin_list --> ( ADMIN )
        const findCoinList = await prisma.coin_list.findFirst({
          where: {
              coin_name: value?.coin_name
            }
        });

        const newAmountUpdateInTableCoinList = parseFloat(findCoinList?.quantity) + parseFloat(value?.quantity);
        await prisma.coin_list.update({
          where: {
              coin_list_id: findCoinList?.coin_list_id
          },
            data: {
                quantity: newAmountUpdateInTableCoinList
            }
        });

        // update USDT in my portfolio , transaction , coin_list --->  ( USER )
        const findUsdtInMyPortfolio = await prisma.portfolio.findFirst({
          where: {
              AND: [{coin_name: constantCoin.USDT},{user_id: value?.user_id}]
            }
        })

        const updateUsdtInMyPortfolio = parseFloat(findUsdtInMyPortfolio?.quantity) + parseFloat(value?.amountUsdt)
        await prisma.portfolio.update({
          data: {
            quantity: updateUsdtInMyPortfolio
          },
          where: {
            portfolio_id: findUsdtInMyPortfolio?.portfolio_id,
          }
        });



        // create buy transaction USDT
        let bodyBuyUsdtInTransaction = {
          coin_name: constantCoin.USDT,
          type: constantStatus.BUY,
          price: value?.amountUsdt,
          quantity: value?.amountUsdt,
          fee: 0,
          user_id: value?.user_id,
          status: constantStatus?.ACTIVE
        }

        await prisma.transaction.create({
          data: bodyBuyUsdtInTransaction,
        });

        const findCoinListUsdt = await prisma.coin_list.findFirst({
          where: {
              coin_name: constantCoin.USDT
            }
        });

        const updateCoinListUsdt = parseFloat(findCoinListUsdt?.quantity) - parseFloat(value?.amountUsdt)
        await prisma.coin_list.update({
          where: {
              coin_list_id: findCoinListUsdt?.coin_list_id
          },
            data: {
                quantity: updateCoinListUsdt
            }
        });
      }

      const checkPortfolioRelationship = await prisma.portfolio.findFirst({
          where: {
              AND: [{coin_name: value?.coin_name},{user_id: value?.user_id}]
          }
      })
      // ถ้าเจอ BTC ใน table portfolio และ สถานะที่ front-end ส่งมาเป็น BUY ?
      if(checkPortfolioRelationship != null && value?.type === constantStatus.BUY){

          // update stock fron coin_list ---> ( USER )
          const findCoinList = await prisma.coin_list.findFirst({
            where: {
                coin_name: value?.coin_name // BTC
              }
          });

          const newAmountUpdateInTableCoinList = parseFloat(findCoinList?.quantity) - parseFloat(value?.quantity);
          await prisma.coin_list.update({
            where: {
                coin_list_id: findCoinList?.coin_list_id
            },
              data: {
                  quantity: newAmountUpdateInTableCoinList
              }
          });

          const findTransactionByCoinName = await prisma.transaction.findMany({
              where: {
                  AND: [{coin_name: value?.coin_name},{status: constantStatus?.ACTIVE}, {user_id: value?.user_id}]
              }
          })

          // sum quantity from list in findTransactionByCoinName
          const sumQuantity = sumQuantitys(findTransactionByCoinName)


          // 1 2 3 4 5 ( BTC )  now --> 5 create transaction --->

          await prisma.portfolio.update({
              data: {
                  weight: 0,
                  average_purchase_price: 0,
                  profit_or_loss: 0,
                  quantity: sumQuantity,
              },
              where: {
                  portfolio_id: checkPortfolioRelationship.portfolio_id,
                  AND: [
                      { user_id: value?.user_id },
                      { coin_name: value?.coin_name }
                  ]
              }
          });
      // ถ้าเจอ BTC ใน table portfolio และ สถานะที่ front-end ส่งมาเป็น SELL ?
      }else if(checkPortfolioRelationship != null && value?.type === constantStatus.SELL){ 

          // update stock fron coin_list ---> ( ADMIN )
          const findCoinList = await prisma.coin_list.findFirst({
            where: {
                coin_name: value?.coin_name
              }
          });

          const newAmountUpdateInTableCoinList = parseFloat(findCoinList?.quantity) + parseFloat(value?.quantity);
          await prisma.coin_list.update({
            where: {
                coin_list_id: findCoinList?.coin_list_id
            },
              data: {
                  quantity: newAmountUpdateInTableCoinList
              }
          });

          // Find ALL Transaction where type = BUY -------> ( USER ) 
          const totalInvestmentsHold = await prisma.transaction.findMany({
              where: {
                  AND: [
                    {coin_name: value?.coin_name},
                    {status: constantStatus?.ACTIVE}, 
                    {user_id: value?.user_id}, 
                    {type: constantStatus.BUY}
                  ]
              }
          })

          // รวมค่าว่า BUY ที่ถืออยู่มีจำนวน BTC เท่าไหร่ ?
          const sumQuantity = sumQuantitys(totalInvestmentsHold)

          // เอา BTC BUY ทั้งหมดมาลบกับจำนวน BTC ที่ USER ขาย
          const finalQuantity = (sumQuantity - value?.quantity)

          if(finalQuantity != 0){
              await prisma.portfolio.update({
                  data: {
                      weight: 0,
                      average_purchase_price: 0,
                      profit_or_loss: 0,
                      quantity: finalQuantity,
                  },
                  where: {
                      portfolio_id: checkPortfolioRelationship.portfolio_id,
                      AND: [
                          { user_id: value?.user_id },
                          { coin_name: value?.coin_name }
                      ]
                  }
              });
              console.log("Updated Successfully ! ");
          }else{

            // Check ALL coin_name when status: ACTIVE
              const allTransaction = await prisma.transaction.findMany({
                  where: {
                      AND: [{coin_name: value?.coin_name},
                          {status: constantStatus?.ACTIVE}, 
                          {user_id: value?.user_id}
                      ]
                  }
              })

              await allTransaction.map((datas => {
                  prisma.transaction.update({ 
                      data: {
                          status: constantStatus?.INACTIVE
                      },
                      where: {
                          transaction_id: datas?.transaction_id,
                          AND: [
                              { user_id: value?.user_id },
                              { coin_name: value?.coin_name }
                          ]
                      }
                  })
              }))
              
              await prisma.portfolio.update({
                  data: {
                      weight: 0,
                      average_purchase_price: 0,
                      profit_or_loss: 0,
                      quantity: finalQuantity,
                  },
                  where: {
                      portfolio_id: checkPortfolioRelationship.portfolio_id,
                      AND: [
                          { user_id: value?.user_id },
                          { coin_name: value?.coin_name }
                      ]
                  }
              });
              console.log("Updated Successfully ! ");
          }
      }else{
          next(error);
          res.status(404)
          console.log("Error checkPortfolioRelationship: --------> ", checkPortfolioRelationship);
      }

      const response = {
        status: constantStatus.SUCCEDD,
        updateTransaction: updateTransaction
      }    
      console.log("updateTransaction: --------> ", updateTransaction);
      res.status(201).json({ response });
  }catch (err) {
     next(err);
  }

}


exports.validate = async (req, res, next) => {
  try {
    let request = req.body;
    const findPortfolio = await prisma.portfolio.findFirst({
          where: {
            AND: [{coin_name: request?.coin_name}, {user_id: request?.user_id}]
          }
      });

      let validate;

      if (!findPortfolio) {
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



const calculateFee = (fee, quantity, price) => {
  return fee * (quantity * price)
}

const sumQuantitys = (dataFromTransaction) => {
  const calculateQuantity = dataFromTransaction.reduce((sum, data) => {
      const quantity = data?.quantity;
      return sum + quantity;
  }, 0)
  return calculateQuantity
}



exports.get = async (req, res, next) => {
  const getCoinListInActive = await prisma.coin_list.findMany({
      where: {
          status: "Inactive",
          NOT:{
              type_coin: "Stablecoin"
          }
      }
      
  })
  res.status(200).json([{getCoinListInActive}]);
};