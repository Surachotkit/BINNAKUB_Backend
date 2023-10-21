const express = require('express')
const coinListController = require('../controllers/coinlist-controller')



const router = express.Router()
router.get('/market', coinListController.getmarket )
router.get('/list/database', coinListController.getListDatabase )

module.exports = router