const cateService = require('../services/categoryService.js')

module.exports = {
  getCategories: (req, res) => {
    cateService.getCategories(req, res, (categories, category) => {
      if (category) return res.json(category)  // admin/categories/:id
      res.json({ categories, category })       // /admin/categories
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