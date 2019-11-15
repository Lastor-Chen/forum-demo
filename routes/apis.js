const router = require('express').Router()
const adminCtrler = require('../controllers/apis/adminCtrler.js')
const cateCtrler = require('../controllers/apis/categoryCtrler.js')
const userCtrler = require('../controllers/apis/userCtrler.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// custom module
const { authenticate, isAuthedAdmin } = require('../middleware/api_auth.js')

// 路由開頭 '/api'
router.use('/admin', authenticate, isAuthedAdmin)
router.get('/admin/restaurants', adminCtrler.getRestaurants)
router.post('/admin/restaurants', upload.single('image'), adminCtrler.postRestaurant)
router.get('/admin/restaurants/:id', adminCtrler.getRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), adminCtrler.putRestaurant)
router.delete('/admin/restaurants/:id', adminCtrler.deleteRestaurant)

router.get('/admin/users', adminCtrler.getUsers)
router.put('/admin/users/:id', adminCtrler.putUser)

router.get('/admin/categories', cateCtrler.getCategories)
router.post('/admin/categories', cateCtrler.postCategory)
router.get('/admin/categories/:id', cateCtrler.getCategories)
router.put('/admin/categories/:id', cateCtrler.putCategory)
router.delete('/admin/categories/:id', cateCtrler.deleteCategory)

router.post('/signin', userCtrler.signIn)
router.post('/signup', userCtrler.signUp)

module.exports = router