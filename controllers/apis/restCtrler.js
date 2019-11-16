const restService = require('../services/restService.js')

module.exports = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, result => res.json(result))
  },

  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, result => res.json(result))
  },

  getFeeds: (req, res) => {
    restService.getFeeds(req, res, result => res.json(result))
  },

  getDashboard: (req, res) => {
    restService.getDashboard(req, res, result => res.json(result))
  },

  getTopRest: (req, res) => {
    restService.getTopRest(req, res, result => res.json(result))
  }
}