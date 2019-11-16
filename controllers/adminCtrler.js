const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const { INTERNAL_SERVER_ERROR } = require('http-status-codes')

const adminService = require('./services/adminService.js')

module.exports = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, restaurants => {
      if (restaurants.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(restaurants)

      res.render('admin/restaurants', { restaurants })
    })
  },

  createRestaurants: (req, res) => {
    Category.findAll()
      .then(categories => {
        res.render('admin/create', { categories })
      })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)

      req.flash(result.status, result.message)
      if (result.status === 'error') return res.redirect('back')

      // success
      res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, restaurant => {
      if (restaurant.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(restaurant)

      res.render('admin/restaurant', { restaurant })
    })
  },

  editRestaurant: async (req, res) => {
    try {
      const [categories, restaurant] = await Promise.all([
        Category.findAll(),
        Restaurant.findByPk(req.params.id)
      ])
      res.render('admin/create', { restaurant, categories })
    }
    catch (err) {
      const message = err.toString()
      console.error(message)
      res.status(INTERNAL_SERVER_ERROR).json({ status: 'serverError', message }) 
    }
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)

      req.flash(result.status, result.message)
      if (result.status === 'error') return res.redirect('back')

      // success
      res.redirect('/admin/restaurants')
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)

      req.flash(result.status, result.message)
      res.redirect('/admin/restaurants') 
    })
  },

  getUsers: (req, res) => {
    adminService.getUsers(req, res, users => {
      if (users.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(users)
      
      res.render('admin/users', { users })
    })
  },

  putUser: (req ,res) => {
    adminService.putUser(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)

      req.flash(result.status, result.message)
      res.redirect('/admin/users')
    })
  }
}