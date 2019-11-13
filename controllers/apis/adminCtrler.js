const adminService = require('../services/adminService.js')

module.exports = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, 
      restaurants => res.json({ restaurants }
    ))
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, 
      restaurant => res.json({ restaurant })
    )
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, 
      result => res.json(result)
    )
  }
}