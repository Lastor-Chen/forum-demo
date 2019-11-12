const router = require('express').Router()
const adminCtrler = require('../controllers/apis/adminCtrler.js')


// 路由開頭 '/api'
router.get('/admin/restaurants', adminCtrler.getRestaurants)
router.get('/admin/restaurants/:id', adminCtrler.getRestaurant)

module.exports = router