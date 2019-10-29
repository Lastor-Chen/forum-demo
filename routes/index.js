const restCtrler = require('../controllers/restCtrler.js')

module.exports = app => {
  app.get('/', (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', restCtrler.getRestaurants)
}