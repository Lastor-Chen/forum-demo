const Category = require('../models').Category

module.exports = {
  getCategories: (req, res) => {
    Category.findAll()
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => res.status(422).json(err))
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
  }
}