const db = require('../../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

module.exports = {
  getRestaurants: async (req, res, cb) => {
    try {
      const restaurants = await Restaurant.findAll({ include: Category })
      cb(restaurants)

    } catch (err) { 
      console.error(err.toString())
      cb({ status: 'error', message: err.toString() })
    }
  },

  postRestaurant: async (req, res, cb) => {
    try {
      // 檢查 name 是否未填
      if (!req.body.name) return cb({ status: 'error', message: "name didn't exist" })

      const input = req.body
      const { file } = req

      // 如果有上傳圖片
      if (file) {
        imgur.setClientId(IMGUR_CLIENT_ID)
        input.image = (await imgur.uploadFile(file.path)).data.link
      }

      // save to database
      const result = await Restaurant.create(input)
      cb({ status: 'success', message: 'restaurant was successfully created', result })
    
    } catch (err) { 
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() }) 
    }
  },

  getRestaurant: async (req, res, cb) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: Category })
      cb(restaurant)

    } catch (err) { 
      console.error(err.toString())
      cb({ status: 'error', message: err.toString() })
    }
  },

  deleteRestaurant: async (req, res, cb) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.destroy()
      cb({ status: 'success', message: 'restaurant was successfully deleted' })

    } catch (err) { 
      console.error(err.toString())
      cb({ status: 'error', message: err.toString() }) 
    }
  },
}