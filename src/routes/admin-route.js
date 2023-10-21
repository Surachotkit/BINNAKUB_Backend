const express = require('express')

const adminController = require('../controllers/admin-controller')
const authenticateMiddleware = require('../middlewares/authenticate')
const uploadMiddleware = require('../middlewares/admin-upload')

const router = express.Router()

router.post("/create", authenticateMiddleware, uploadMiddleware.single("image_coin"),adminController.uploadLogoCoin)
router.patch("/addquantity", adminController.addQuantity)
router.delete("/delete/:coin_list_id", adminController.deleteCoin)

module.exports = router