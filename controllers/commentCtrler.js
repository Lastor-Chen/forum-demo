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
  }
}