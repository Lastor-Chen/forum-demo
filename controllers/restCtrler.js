const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

module.exports = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ include: Category })
      .then(restaurants => {
        res.render('restaurants', { css: 'restaurants', restaurants })
      })
      .catch(err => res.status(422).json(err.toString()))
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => res.render('restaurant', { restaurant }))
  }
}