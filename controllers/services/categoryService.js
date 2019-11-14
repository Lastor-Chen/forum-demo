const Category = require('../../models').Category

module.exports = {
  getCategories: async (req, res, cb) => {
    try {
      const cateId = +req.params.id
      const categories = await Category.findAll()
      let category = null
      if (cateId) { category = categories.find(item => item.id === cateId) }

      cb(categories, category)

    } catch (err) {
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() }) 
    }
  },

  postCategory: async (req, res, cb) => {
    try {
      const name = req.body.name
      if (!name) return cb({ status: 'error', message: 'name did not exist'})

      const category = await Category.create({ name })
      cb({ status: 'success', message: 'category was successfully created', category })

    } catch (err) {
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  },
}