const sequelize = require('sequelize')
const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

const restService = require('../services/restService.js')

// restaurants 單頁資料筆數
const pageLimit = 10

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