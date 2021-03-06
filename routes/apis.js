const router = require('express').Router()
const adminCtrler = require('../controllers/apis/adminCtrler.js')
const cateCtrler = require('../controllers/apis/categoryCtrler.js')
const userCtrler = require('../controllers/apis/userCtrler.js')
const restCtrler = require('../controllers/apis/restCtrler.js')
const commentCtrler = require('../controllers/apis/commentCtrler.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// custom module
const { authenticate, isAuthedAdmin } = require('../middleware/api_auth.js')

// 路由開頭 '/api'
router.use('/restaurants', authenticate)
router.get('/restaurants', restCtrler.getRestaurants)
router.get('/restaurants/feeds', restCtrler.getFeeds)
router.get('/restaurants/top', restCtrler.getTopRest)
router.get('/restaurants/:id', restCtrler.getRestaurant)
router.get('/restaurants/:id/dashboard', restCtrler.getDashboard)

router.post('/favorite/:RestaurantId', authenticate, userCtrler.addFavorite)
router.delete('/favorite/:RestaurantId', authenticate, userCtrler.removeFavorite)

router.post('/like/:RestaurantId', authenticate, userCtrler.addLike)
router.delete('/like/:RestaurantId', authenticate, userCtrler.removeLike)

router.post('/comments', authenticate, commentCtrler.postComment)
router.delete('/comments/:id', authenticate, isAuthedAdmin, commentCtrler.deleteComment)

router.use('/users', authenticate)
router.get('/users/top', userCtrler.getTopUser)
router.get('/users/:id', userCtrler.getUser)
router.put('/users/:id', upload.single('image'), userCtrler.putUser)

router.post('/following/:userId', authenticate, userCtrler.addFollowing)
router.delete('/following/:userId', authenticate, userCtrler.removeFollowing)

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