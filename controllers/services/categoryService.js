const Category = require('../../models').Category

module.exports = {
  getCategories: async (req, res, cb) => {
    try {
      const cateId = +req.params.id
      const categories = await Category.findAll()
      let category = null
      if (cateId) { category = categories.find(item => item.id === cateId) }

      cb(categories, category)
    } catch (err) { res.status(BAD_GATEWAY).send(err.toString()) }
  }
}