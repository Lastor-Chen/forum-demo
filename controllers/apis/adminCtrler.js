const adminService = require('../services/adminService.js')

module.exports = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, 
      restaurants => res.json({ restaurants }
    ))
  }
}