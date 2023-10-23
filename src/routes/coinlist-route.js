const express = require('express')
const coinListController = require('../controllers/coinlist-controller')
const authenticateMiddleware = require('../middlewares/authenticate')



const router = express.Router()
router.get('/market', authenticateMiddleware,coinListController.getmarket )
router.get('/list/database', authenticateMiddleware,coinListController.getListDatabase )

module.exports = router