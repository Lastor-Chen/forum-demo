const sequelize = require('sequelize')
const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

// restaurants 單頁資料筆數
const pageLimit = 10

module.exports = {
  getRestaurants: async (req, res, cb) => {
    try {
      // 類別資料
      const CategoryId = +req.query.categoryId || ''
      const whereQuery = CategoryId ? { where: { CategoryId } } : {}

      // 頁面資料
      const page = +req.query.page || 1
      const offset = (page - 1) * pageLimit

      // db Query
      const [result, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          ...whereQuery,
          order: [['id', 'ASC']],
          include: Category,
          offset,
          limit: pageLimit
        }),
        Category.findAll()
      ])
      const restaurants = result.rows.map(rest => {
        rest.isFavorite = req.user.FavoriteRestaurants.some(v => v.id === rest.id)
        rest.isLiked = req.user.LikedRestaurants.some(v => v.id === rest.id)
        return rest
      })

      // 分頁 bar 資料
      const totalPages = Math.ceil(result.count / pageLimit)
      const pagesArray = [...Array(totalPages).keys()].map(val => ++val)
      const prev = (page === 1) ? 1 : page - 1
      const next = (page === totalPages) ? totalPages : page + 1

      cb({ css: 'restaurants', restaurants, categories, CategoryId, page, pagesArray, prev, next })

    } catch (err) { 
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  },

  getRestaurant: async (req, res, cb) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [{
          all: true,
          nested: true
        }]
      })

      await restaurant.increment('viewCounts')
      const isFavorite = restaurant.FavoriteUsers.some(user => user.id === req.user.id)
      const isLiked = restaurant.LikedUsers.some(user => user.id === req.user.id)
      cb({ css: 'restaurant', restaurant, isFavorite, isLiked })

    } catch (err) {
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  },

  getFeeds: async (req, res, cb) => {
    try {
      const option = { limit: 10, order: [['createdAt', 'DESC']] }
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({ ...option, include: Category }),
        Comment.findAll({ ...option, include: [User, Restaurant] })
      ])

      cb({ restaurants, comments })

    } catch (err) { 
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  },

  getDashboard: async (req, res, cb) => {
    try {
      const RestaurantId = +req.params.id
      const restaurant = await Restaurant.findByPk(RestaurantId, { include: [Category, Comment] })
      cb(restaurant)

    } catch (err) { 
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  },

  getTopRest: async (req, res, cb) => {
    /**
     * @literal 處理 PostgreSQL(heroku) / MySQL 語法不兼容問題
     * @MySQL 語法參照↓
     * SELECT *, (SELECT COUNT(*) FROM favorites WHERE favorites.RestaurantId = restaurants.id) AS favUserCount
     * FROM restaurants
     * ORDER BY favUserCount DESC;
     */
    let literal = '(SELECT COUNT(*) FROM Favorites WHERE Favorites.RestaurantId = Restaurant.id)'
    if (process.env.NODE_ENV === 'production') {
      literal = '(SELECT COUNT(*) FROM "Favorites" WHERE "Favorites"."RestaurantId" = "Restaurant".id)'
    }

    try {
      const restaurants = (
        await Restaurant.findAll({
          attributes: { include: [[sequelize.literal(literal), 'favUserCount']] },
          order: [[sequelize.col('favUserCount'), 'DESC']],
          limit: 10
        })
        .map(rest => {  // 迭代添加 .isFavorite 屬性
          rest.isFavorite = req.user.FavoriteRestaurants.some(v => v.id === rest.id)
          return rest
        })
        .filter(rest => rest.dataValues.favUserCount > 0)  // 頁面不列出，未被收藏者
      )

      cb({ css: 'topRestaurants', restaurants })

    } catch (err) {
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  }
}