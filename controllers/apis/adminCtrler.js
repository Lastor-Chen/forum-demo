const adminService = require('../services/adminService.js')

module.exports = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, restaurants => res.json(restaurants))
  },

  postRestaurant: (req, res, cb) => {
    adminService.postRestaurant(req, res, result => res.json(result))
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, restaurant => res.json(restaurant))
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, result => res.json(result))
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, result => res.json(result))
  },

  getUsers: (req, res) => {
    adminService.getUsers(req, res, users => res.json(users))
  },

  putUser: (req, res) => {
    adminService.putUser(req, res, result => res.json(result))
  }
}