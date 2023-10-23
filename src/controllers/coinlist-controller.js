const prisma = require("../models/prisma");

exports.getmarket = async (req, res, next) => {

    const getCoinList = await prisma.coin_list.findMany({
        where: {
            status: "Active",
            NOT:{
                type_coin: "Stablecoin"
            }
        }
        
    })


    console.log("🚀 ~ file: coinlist-controller.js:9 ~ exports.getmarket= ~ get:", getCoinList)
    res.status(200).json([{getCoinList}]);
  };

  exports.getListDatabase = async (req, res, next) => {
    const getCoinListInActive = await prisma.coin_list.findMany({
        where: {
            status: "Inactive",
            NOT:{
                type_coin: "Stablecoin"
            }
        }
        
    })
    console.log("🚀 ~ file: coinlist-controller.js:9 ~ exports.getmarket= ~ get:", getCoinListInActive)
    res.status(200).json([{getCoinListInActive}]);
  };
