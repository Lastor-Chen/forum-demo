const db = require('../../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const { BAD_GATEWAY } = require('http-status-codes')

module.exports = {
  getRestaurants: async (req, res, cb) => {
    try {
      const restaurants = await Restaurant.findAll({ include: Category })
      cb(restaurants)

    } catch (err) { res.status(BAD_GATEWAY).send(err.toString()) }
  },

  getRestaurant: async (req, res, cb) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: Category })
      cb(restaurant)

    } catch (err) { res.status(422).json(err) }
  },

  deleteRestaurant: async (req, res, cb) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.destroy()
      cb({ status: 'success', message: 'restaurant was successfully deleted' })

    } catch (err) { cb({ status: 'error', message: err.toString() }) }
  },
}