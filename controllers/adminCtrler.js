const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const { BAD_GATEWAY } = require('http-status-codes')

const adminService = require('./services/adminService.js')

module.exports = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, 
      restaurants => {
        if (restaurants.status === 'error') return res.status(BAD_GATEWAY).json(restaurants)
        
        res.render('admin/restaurants', { restaurants })
      }
    )
  },

  createRestaurants: (req, res) => {
    Category.findAll()
      .then(categories => {
        res.render('admin/create', { categories })
      })
  },

  postRestaurant: async (req, res) => {
    adminService.postRestaurant(req, res,
      result => {
        if (result.status === 'serverError') return res.status(BAD_GATEWAY).json(result)

        req.flash(result.status, result.message)
        if (result.status === 'error') return res.redirect('back')

        // success
        res.redirect('/admin/restaurants')
      }
    )
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res,
      restaurant => {
        if (restaurant.status === 'error') return res.status(BAD_GATEWAY).json(restaurant)

        res.render('admin/restaurant', { restaurant })
      }
    )
  },

  editRestaurant: async (req, res) => {
    try {
      const categories = await Category.findAll()
      const restaurant = await Restaurant.findByPk(req.params.id)
      res.render('admin/create', { restaurant, categories })
    }
    catch (err) { res.status(422).json(err) }
  },

  putRestaurant: async (req, res) => {
    if (!req.body.name) {
      req.flash('error', "name didn't exist")
      return res.redirect('back')
    }

    const input = req.body
    const { file } = req
    if (file) {
      imgur.setClientId(IMGUR_CLIENT_ID)
      try {
        const img = await imgur.uploadFile(file.path)
        input.image = img.data.link
      }
      catch (err) { console.error(err) }
    } 

    try { 
      const restaurant = await Restaurant.findByPk(req.params.id)

      restaurant.update(input)
        .then(restaurant => {
          req.flash('success', 'restaurant was successfully updated')
          res.redirect('/admin/restaurants')
        })
        .catch(err => res.status(422).json(err))
    }
    catch (err) { res.status(422).json(err) }
  },

  deleteRestaurant: async (req, res) => {
    adminService.deleteRestaurant(req, res, 
      result => {
        if (result.status === 'error') return res.status(BAD_GATEWAY).json(result)

        req.flash(result.status, result.message)
        res.redirect('/admin/restaurants') 
      }
    )
  },

  getUsers: (req, res) => {
    User.findAll({ order: [['id', 'ASC']] })
      .then(users => res.render('admin/users', { users }))
      .catch(err => res.status(422).json(err))
  },

  putUsers: async (req ,res) => {
    try {
      const user = await User.findByPk(req.params.id)
      user.isAdmin = !user.isAdmin

      await user.save()
      req.flash('success', 'user was successfully updated')
      res.redirect('/admin/users')
    }
    catch (err) { res.status(422).json(err) }
  }
}