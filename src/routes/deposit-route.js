const express = require('express')
const depositController = require('../controllers/deposit-controller')
const authenticateMiddleware = require('../middlewares/authenticate')

const router = express.Router()

router.post('/create', authenticateMiddleware,depositController.create)

module.exports = router