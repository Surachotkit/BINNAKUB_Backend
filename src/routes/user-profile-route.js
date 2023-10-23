const express = require('express')

const userProfileController = require('../controllers/user-profile-controller')
const authenticateMiddleware = require('../middlewares/authenticate')

const router = express.Router()

router.get('/', authenticateMiddleware,userProfileController.get)
router.get('/getUsdtByUserId',authenticateMiddleware, userProfileController.getUsdtByUserId)
router.get('/getTransactionProfile', authenticateMiddleware,userProfileController.getTransactionProfile)
router.get('/getDepositProfile', authenticateMiddleware,userProfileController.getDepositProfile)


module.exports = router