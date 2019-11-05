const Restaurant = require('../models').Restaurant
const User = require('../models').User
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

module.exports = {
  getRestaurants: (req, res) => {
    Restaurant.findAll()
      .then(restaurants => {
        res.render('admin/restaurants', { restaurants })
      })
      .catch(err => res.status(422).json(err))
  },

  createRestaurants: (req, res) => res.render('admin/create'),

  postRestaurants: async (req, res) => {
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
    
    Restaurant.create(input)
      .then(restaurant => {
        req.flash('success', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => res.status(422).json(err))
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => res.render('admin/restaurant', { restaurant }))
      .catch(err => res.status(422).json(err))
  },

  editRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => res.render('admin/create', { restaurant }))
      .catch(err => res.status(422).json(err))
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

  deleteRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => { 
            req.flash('success', 'restaurant was successfully deleted')
            res.redirect('/admin/restaurants') 
          })
          .catch(err => res.status(422).json(err))
      })
      .catch(err => res.status(422).json(err))
  },

  editUsers: (req, res) => {
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