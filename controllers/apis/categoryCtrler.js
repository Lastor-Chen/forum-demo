const cateService = require('../services/categoryService.js')

module.exports = {
  getCategories: (req, res) => {
    cateService.getCategories(req, res, result => {
      if (result.category) return res.json(result.category)  // admin/categories/:id
      res.json(result.categories)                            // admin/categories
    })
  },

  postCategory: (req, res) => {
    cateService.postCategory(req, res, result => res.json(result))
  },

  putCategory: (req, res) => {
    cateService.putCategory(req, res, result => res.json(result))
  },

  deleteCategory: (req, res) => {
    cateService.deleteCategory(req, res, result => res.json(result))
  }
}