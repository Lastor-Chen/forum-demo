const db = require('../../models')
const Comment = db.Comment

module.exports = {
  postComment: async (req, res, cb) => {
    try {
      if (!req.body.RestaurantId) return cb({ status: 'error', message: 'RestaurantId column is required' })

      const newComment = req.body
      newComment.UserId = req.user.id

      const comment = await Comment.create(newComment)
      cb({ status: 'success', message: 'comment was be created', comment })

    } catch (err) {
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  },

  deleteComment: async (req, res, cb) => {
    try {
      const comment = await Comment.findByPk(req.params.id)
      await comment.destroy()
      cb({ status: 'success', message: 'comment was successfully deleted', comment })

    } catch (err) { 
      console.error(err.toString())
      cb({ status: 'serverError', message: err.toString() })
    }
  }
}