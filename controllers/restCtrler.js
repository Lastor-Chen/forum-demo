const { INTERNAL_SERVER_ERROR } = require('http-status-codes')
const restService = require('./services/restService.js')

module.exports = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)
      res.render('restaurants', result)
    })
  },

  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)
      res.render('restaurant', result)
    })
  },

  getFeeds: (req, res) => {
    restService.getFeeds(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)
      res.render('feeds', result)
    })
  },

  getDashboard: (req, res) => {
    restService.getDashboard(req, res, restaurant => {
      if (restaurant.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(restaurant)
      res.render('dashboard', { restaurant })
    })
  },

  getTopRest: (req, res) => {
    restService.getTopRest(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)
      res.render('topRestaurants', result)
    })
  }
}