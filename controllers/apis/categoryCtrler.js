const cateService = require('../services/categoryService.js')

module.exports = {
  getCategories: (req, res) => {
    cateService.getCategories(req, res, 
      (categories, category) => res.json({ categories, category })
    )
  },

  postCategory: (req, res) => {
    cateService.postCategory(req, res, result => res.json(result))
  },

  putCategory: (req, res) => {
    cateService.putCategory(req, res, result => res.json(result))
  }
}