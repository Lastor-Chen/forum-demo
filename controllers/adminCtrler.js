const Restaurant = require('../models').Restaurant

module.exports = {
  getRestaurants: (req, res) => {
    Restaurant.findAll()
      .then(restaurants => {
        res.render('admin/restaurants', { restaurants })
      })
      .catch(err => res.status(422).json(err))
  }
}