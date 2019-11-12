const cateService = require('../services/categoryService.js')

module.exports = {
  getCategories: (req, res) => {
    cateService.getCategories(req, res, 
      (categories, category) => res.json({ categories, category })
    )
  }
}