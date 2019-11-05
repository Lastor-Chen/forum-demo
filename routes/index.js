const restCtrler = require('../controllers/restCtrler.js')
const adminCtrler = require('../controllers/adminCtrler.js')
const userCtrler = require('../controllers/userCtrler.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// custom module
const { isAuthed, isAuthedAdmin } = require('../middlewares/isAuth.js')

module.exports = (app, passport) => {
  app.get('/', isAuthed, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', isAuthed, restCtrler.getRestaurants)

  app.use('/admin', isAuthedAdmin)
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', adminCtrler.getRestaurants)
  app.get('/admin/restaurants/create', adminCtrler.createRestaurants)
  app.post('/admin/restaurants', upload.single('image'), adminCtrler.postRestaurants)
  app.get('/admin/restaurants/:id', adminCtrler.getRestaurant)
  app.get('/admin/restaurants/:id/edit', adminCtrler.editRestaurant)
  app.put('/admin/restaurants/:id', upload.single('image'), adminCtrler.putRestaurant)
  app.delete('/admin/restaurants/:id', adminCtrler.deleteRestaurant)
  app.get('/admin/users', adminCtrler.editUsers)
  app.put('/admin/users/:id', adminCtrler.putUsers)

  app.get('/signup', userCtrler.signUpPage)
  app.post('/signup', userCtrler.signUp)

  app.get('/signin', userCtrler.signInPage)
  app.post('/signin', userCtrler.signIn.bind(null, passport))
  app.get('/logout', userCtrler.logout)
}