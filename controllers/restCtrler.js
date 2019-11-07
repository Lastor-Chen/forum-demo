const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

module.exports = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ include: Category })
      .then(restaurants => {
        restaurants.forEach(item => {
          item.description = item.description.slice(0, 50)
        })
        res.render('restaurants', { restaurants })
      })
      .catch(err => res.status(422).json(err.toString()))
  }
}