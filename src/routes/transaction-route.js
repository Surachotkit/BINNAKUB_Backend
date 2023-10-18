const express = require('express')
const transactionController = require('../controllers/transaction-controller')
const authenticateMiddleware = require('../middlewares/authenticate')

const router = express.Router()

router.post('/create',authenticateMiddleware,transactionController.create)

module.exports = router