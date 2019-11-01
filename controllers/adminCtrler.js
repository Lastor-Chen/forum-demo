const Restaurant = require('../models').Restaurant

module.exports = {
  getRestaurants: (req, res) => {
    Restaurant.findAll()
      .then(restaurants => {
        res.render('admin/restaurants', { restaurants })
      })
      .catch(err => res.status(422).json(err))
  },

  createRestaurants: (req, res) => res.render('admin/create'),

  postRestaurants: (req, res) => {
    if (!req.body.name) {
      req.flash('error', "name didn't exist")
      return res.redirect('back')
    }

    const input = req.body
    Restaurant.create(input)
      .then(restaurant => {
        req.flash('success', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => res.status(422).json(err))
  }
}