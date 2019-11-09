const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

// restaurants 單頁資料筆數
const pageLimit = 10

module.exports = {
  getRestaurants: async (req, res) => {
    try {
      // 類別資料
      const CategoryId = +req.query.categoryId || ''
      const whereQuery = CategoryId ? { where: { CategoryId } } : {}
      
      // 頁面資料
      const page = +req.query.page || 1
      const offset = (page - 1) * pageLimit

      // db Query
      const result = await Restaurant.findAndCountAll({ 
        ...whereQuery, 
        order: [['id', 'ASC']],
        include: Category, 
        offset, 
        limit: pageLimit })
      const categories = await Category.findAll()
      const restaurants = result.rows.map(rest => {
        rest.isFavorite = req.user.FavoriteRestaurants.map(v => v.id).includes(rest.id)
        rest.isLiked = req.user.LikedRestaurants.map(v => v.id).includes(rest.id)
        return rest
      })

      // 分頁 bar 資料
      const totalPages = Math.ceil(result.count / pageLimit)
      const pagesArray = [...Array(totalPages).keys()].map(val => ++val)
      const prev = (page === 1) ? 1 : page - 1
      const next = (page === totalPages) ? totalPages : page + 1

      res.render('restaurants', { 
        css: 'restaurants', restaurants, categories, CategoryId, page, pagesArray, prev, next
      })
    }
    catch (err) { res.status(422).json(err.toString()) }
  },

  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [{
          all: true,
          nested: true
        }]
      })
      
      await restaurant.increment('viewCounts')
      const isFavorite = restaurant.FavoriteUsers.map(user => user.id).includes(req.user.id)
      const isLiked = restaurant.LikedUsers.map(user => user.id).includes(req.user.id)
      res.render('restaurant', { css: 'restaurant', restaurant, isFavorite, isLiked })
    } catch (err) { res.status(422).json(err.toString()) }
  },

  getFeeds: async (req, res) => {
    try {
      const option = { limit: 10, order: [['createdAt', 'DESC']] }
      const restaurants = await Restaurant.findAll({ ...option, include: Category})
      const comments = await Comment.findAll({ ...option, include: [User, Restaurant] })

      res.render('feeds', { restaurants, comments })
    } catch (err) { res.status(422).json(err.toString()) }
  },

  getDashboard: async (req, res) => {
    try {
      const RestaurantId = +req.params.id
      const restaurant = await Restaurant.findByPk(RestaurantId, { include: [Category, Comment] })

      res.render('dashboard', { restaurant })
    } catch (err) { res.status(422).json(err.toString()) }
  }
}