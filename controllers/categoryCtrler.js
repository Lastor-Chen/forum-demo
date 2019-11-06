const Category = require('../models').Category

module.exports = {
  getCategories: (req, res) => {
    Category.findAll()
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => res.status(422).json(err))
  }
}