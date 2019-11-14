const router = require('express').Router()
const adminCtrler = require('../controllers/apis/adminCtrler.js')
const cateCtrler = require('../controllers/apis/categoryCtrler.js')
const userCtrler = require('../controllers/apis/userCtrler.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


// 路由開頭 '/api'
router.get('/admin/restaurants', adminCtrler.getRestaurants)
router.post('/admin/restaurants', upload.single('image'), adminCtrler.postRestaurant)
router.get('/admin/restaurants/:id', adminCtrler.getRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), adminCtrler.putRestaurant)
router.delete('/admin/restaurants/:id', adminCtrler.deleteRestaurant)

router.get('/admin/categories', cateCtrler.getCategories)
router.post('/admin/categories', cateCtrler.postCategory)
router.put('/admin/categories/:id', cateCtrler.putCategory)
router.delete('/admin/categories/:id', cateCtrler.deleteCategory)

router.post('/signin', userCtrler.signIn)

module.exports = router