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

  putCategory: async (req, res, cb) => {
    try {
      if (!req.body.name) return cb({ status: 'error', message: 'name did not exist' })

      const category = await Category.findByPk(req.params.id)
      const result = await category.update(req.body)

      cb({ status: 'success', message: 'category was successfully updated', result })

    } catch (err) {
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  },

  deleteCategory: async (req, res, cb) => {
    try {
      const category = await Category.findByPk(req.params.id)
      const result = await category.destroy()
      cb({ status: 'success', message: 'category was successfully deleted', result })
    }
    catch (err) {
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  }
}