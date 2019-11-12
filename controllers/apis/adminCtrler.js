const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category
const { BAD_GATEWAY } = require('http-status-codes')

module.exports = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ include: Category })
      .then(restaurants => res.json({ restaurants }))
      .catch(err => res.status(BAD_GATEWAY).json(err))
  }
}