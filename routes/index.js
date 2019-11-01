const restCtrler = require('../controllers/restCtrler.js')
const adminCtrler = require('../controllers/adminCtrler.js')
const userCtrler = require('../controllers/userCtrler.js')

function isAuthed(req, res, next) {
  if (!req.isAuthenticated()) return res.redirect('/signin')
  next()
}
function isAuthedAdmin(req, res, next) {
  if (!req.isAuthenticated()) return res.redirect('/signin')

  if (req.user.isAdmin) return next()
  res.redirect('/restaurants')
}

module.exports = (app, passport) => {
  app.get('/', isAuthed, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', isAuthed, restCtrler.getRestaurants)

  app.get('/admin', isAuthedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', isAuthedAdmin, adminCtrler.getRestaurants)
  app.get('/admin/restaurants/create', isAuthedAdmin, adminCtrler.createRestaurants)
  app.post('/admin/restaurants', isAuthedAdmin, adminCtrler.postRestaurants)

  app.get('/signup', userCtrler.signUpPage)
  app.post('/signup', userCtrler.signUp)

  app.get('/signin', userCtrler.signInPage)
  app.post('/signin', userCtrler.signIn.bind(null, passport))
  app.get('/logout', userCtrler.logout)
}