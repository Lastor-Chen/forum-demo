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
      const result = await Restaurant.findAndCountAll({ ...whereQuery, include: Category, offset, limit: pageLimit })
      const restaurants = result.rows
      const categories = await Category.findAll()

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

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, { 
      include: [{ 
        all: true, 
        nested: true 
      }]
    })
      .then(restaurant => {
        res.render('restaurant', { restaurant })
      })
      .catch(err => res.status(422).json(err.toString()))
  }
}