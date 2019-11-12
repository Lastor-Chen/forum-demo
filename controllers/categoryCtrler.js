const Category = require('../models').Category
const cateService = require('./services/categoryService.js')

module.exports = {
  getCategories: (req, res) => {
    cateService.getCategories(req, res,
      (categories, category) => res.render('admin/categories', { categories, category })
    )
  },

  postCategory: (req, res) => {
    const name = req.body.name
    if (!name) {
      req.flash('error', 'name did not exist')
      return res.redirect('back')
    }

    Category.create({ name })
      .then(category => {
        req.flash('success', 'category was successfully created')
        res.redirect('/admin/categories')
      })
      .catch(err => res.status(422).json(err))
  },

  putCategory: async (req, res) => {
    if (!req.body.name) {
      req.flash('error', 'name did not exist')
      return res.redirect('back')
    }

    try {
      const category = await Category.findByPk(req.params.id)
      await category.update(req.body)

      req.flash('success', 'category was successfully updated')
      res.redirect('/admin/categories')
    }
    catch (err) { res.status(422).json(err.toString()) }
  },

  deleteCategory: async (req, res) =>{
    try {
      const category = await Category.findByPk(req.params.id)
      await category.destroy()
      req.flash('success', 'category was successfully deleted')
      res.redirect('/admin/categories')
    }
    catch (err) { res.status(422).json(err.toString()) }
  }
}