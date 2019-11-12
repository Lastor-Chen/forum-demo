const router = require('express').Router()
const adminCtrler = require('../controllers/apis/adminCtrler.js')


// 路由開頭 '/api'
router.get('/admin/restaurants', adminCtrler.getRestaurants)

module.exports = router