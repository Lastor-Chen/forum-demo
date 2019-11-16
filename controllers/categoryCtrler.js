const cateService = require('./services/categoryService.js')
const { INTERNAL_SERVER_ERROR } = require('http-status-codes')

module.exports = {
  getCategories: (req, res) => {
    cateService.getCategories(req, res, result => {
      res.render('admin/categories', result)
    })
  },

  postCategory: (req, res) => {
    cateService.postCategory(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)

      req.flash(result.status, result.message)
      if (result.status === 'error') return res.redirect('back')

      // success
      res.redirect('/admin/categories')
    })
  },

  putCategory: async (req, res) => {
    cateService.putCategory(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)

      req.flash(result.status, result.message)
      if (result.status === 'error') return res.redirect('back')

      // success
      res.redirect('/admin/categories')
    })
  },

  deleteCategory: async (req, res) => {
    cateService.deleteCategory(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)

      // success
      req.flash(result.status, result.message)
      res.redirect('/admin/categories')
    })
  }
}