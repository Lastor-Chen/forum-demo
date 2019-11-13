const router = require('express').Router()
const adminCtrler = require('../controllers/apis/adminCtrler.js')
const cateCtrler = require('../controllers/apis/categoryCtrler.js')


// 路由開頭 '/api'
router.get('/admin/restaurants', adminCtrler.getRestaurants)
router.get('/admin/restaurants/:id', adminCtrler.getRestaurant)
router.delete('/admin/restaurants/:id', adminCtrler.deleteRestaurant)

router.get('/admin/categories', cateCtrler.getCategories)

module.exports = router