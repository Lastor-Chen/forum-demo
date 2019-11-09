const restCtrler = require('../controllers/restCtrler.js')
const adminCtrler = require('../controllers/adminCtrler.js')
const userCtrler = require('../controllers/userCtrler.js')
const cateCtrler = require('../controllers/categoryCtrler.js')
const commentCtrler = require('../controllers/commentCtrler.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// custom module
const { isAuthed, isAuthedAdmin } = require('../middlewares/isAuth.js')

module.exports = (app, passport) => {
  app.get('/', isAuthed, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', isAuthed, restCtrler.getRestaurants)
  app.get('/restaurants/feeds', isAuthed, restCtrler.getFeeds)
  app.get('/restaurants/:id', isAuthed, restCtrler.getRestaurant)
  app.get('/restaurants/:id/dashboard', isAuthed, restCtrler.getDashboard)
  
  app.post('/favorite/:RestaurantId', isAuthed, userCtrler.addFavorite)
  app.delete('/favorite/:RestaurantId', isAuthed, userCtrler.removeFavorite)

  app.post('/like/:RestaurantId', isAuthed, userCtrler.addLike)
  app.delete('/like/:RestaurantId', isAuthed, userCtrler.removeLike)

  app.post('/comments', isAuthed, commentCtrler.postComment)
  app.delete('/comments/:id', isAuthedAdmin, commentCtrler.deleteComment)
  
  app.get('/users/top', isAuthed, userCtrler.getTopUser)
  app.get('/users/:id', isAuthed, userCtrler.getUser)
  app.get('/users/:id/edit', isAuthed, userCtrler.editUser)
  app.put('/users/:id/', isAuthed, upload.single('image'), userCtrler.putUser)

  app.post('/following/:userId', isAuthed, userCtrler.addFollowing)
  app.delete('/following/:userId', isAuthed, userCtrler.removeFollowing)

  app.use('/admin', isAuthedAdmin)
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', adminCtrler.getRestaurants)
  app.get('/admin/restaurants/create', adminCtrler.createRestaurants)
  app.post('/admin/restaurants', upload.single('image'), adminCtrler.postRestaurants)
  app.get('/admin/restaurants/:id', adminCtrler.getRestaurant)
  app.get('/admin/restaurants/:id/edit', adminCtrler.editRestaurant)
  app.put('/admin/restaurants/:id', upload.single('image'), adminCtrler.putRestaurant)
  app.delete('/admin/restaurants/:id', adminCtrler.deleteRestaurant)
  app.get('/admin/users', adminCtrler.getUsers)
  app.put('/admin/users/:id', adminCtrler.putUsers)
  app.get('/admin/categories', cateCtrler.getCategories)
  app.post('/admin/categories', cateCtrler.postCategory)
  app.get('/admin/categories/:id', cateCtrler.getCategories)
  app.put('/admin/categories/:id', cateCtrler.putCategory)
  app.delete('/admin/categories/:id', cateCtrler.deleteCategory)

  app.get('/signup', userCtrler.signUpPage)
  app.post('/signup', userCtrler.signUp)

  app.get('/signin', userCtrler.signInPage)
  app.post('/signin', userCtrler.signIn.bind(null, passport))
  app.get('/logout', userCtrler.logout)
}