const db = require('../models')
const Comment = db.Comment

module.exports = {
  postComment: (req, res) => {
    console.log(req.body)
    const newComment = req.body
    newComment.UserId = req.user.id

    Comment.create(newComment)
      .then(comment => {
        res.redirect(`/restaurants/${newComment.RestaurantId}`)
      })
      .catch(err => res.status(422).json(err.toString()))
  },

  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findByPk(req.params.id)
      await comment.destroy()
      res.redirect(`/restaurants/${comment.RestaurantId}`)
    }
    catch (err) { res.status(422).json(err.toString())  }
        
  }
}