const express = require('express')
const transactionController = require('../controllers/transaction-controller')
const authenticateMiddleware = require('../middlewares/authenticate')

const router = express.Router()

router.post('/create',transactionController.create)
router.post('/validate', transactionController.validate)
router.post('/update', transactionController.update)

module.exports = router