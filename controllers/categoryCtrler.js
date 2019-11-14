const Category = require('../models').Category
const cateService = require('./services/categoryService.js')
const { BAD_GATEWAY } = require('http-status-codes')

module.exports = {
  getCategories: (req, res) => {
    cateService.getCategories(req, res,
      (categories, category) => res.render('admin/categories', { categories, category })
    )
  },

  postCategory: (req, res) => {
    cateService.postCategory(req, res, result => {
      if (result.status === 'serverError') return res.status(BAD_GATEWAY).json(result)

      req.flash(result.status, result.message)
      if (result.status === 'error') return res.redirect('back')

      // success
      res.redirect('/admin/categories')
    })
  },

  putCategory: async (req, res) => {
    cateService.putCategory(req, res, result => {
      if (result.status === 'serverError') return res.status(BAD_GATEWAY).json(result)

      req.flash(result.status, result.message)
      if (result.status === 'error') return res.redirect('back')

      // success
      res.redirect('/admin/categories')
    })
  },

  deleteCategory: async (req, res) => {
    cateService.deleteCategory(req, res, result => {
      if (result.status === 'serverError') return res.status(BAD_GATEWAY).json(result)

      // success
      req.flash(result.status, result.message)
      res.redirect('/admin/categories')
    })
  }
}