const restCtrler = require('../controllers/restCtrler.js')
const adminCtrler = require('../controllers/adminCtrler.js')
const userCtrler = require('../controllers/userCtrler.js')

module.exports = (app, passport) => {
  app.get('/', (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', restCtrler.getRestaurants)

  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', adminCtrler.getRestaurants)

  app.get('/signup', userCtrler.signUpPage)
  app.post('/signup', userCtrler.signUp)

  app.get('/signin', userCtrler.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userCtrler.signIn)
  app.get('/logout', userCtrler.logout)
}