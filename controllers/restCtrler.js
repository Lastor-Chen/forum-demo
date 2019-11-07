const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

module.exports = {
  getRestaurants: async (req, res) => {
    try {
      const CategoryId = req.query.categoryId
      const whereQuery = CategoryId ? { where: { CategoryId } } : {}
      const restaurants = await Restaurant.findAll({ ...whereQuery, include: Category })
      const categories = await Category.findAll()

      res.render('restaurants', { css: 'restaurants', restaurants, categories, CategoryId })
    }
    catch (err) { res.status(422).json(err.toString()) }
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => res.render('restaurant', { restaurant }))
  }
}