const Category = require('../models').Category

module.exports = {
  getCategories: (req, res) => {
    const cateId = +req.params.id 
    Category.findAll()
      .then(categories => {
        // request 帶 'categories/:id' 時，找出對應物件
        let category = null
        if (cateId) { category = categories.find(item => item.id === cateId) }

        res.render('admin/categories', { categories, category })
      })
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
  }
}