const prisma = require("../models/prisma");

exports.getmarket = async (req, res, next) => {
    const getCoinList = await prisma.coin_list.findMany({
        where: {
            status: "Active"
        }
    })
    console.log("🚀 ~ file: coinlist-controller.js:9 ~ exports.getmarket= ~ get:", getCoinList)
    res.status(200).json([{getCoinList}]);
  };