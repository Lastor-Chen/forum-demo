const commentService = require('../services/commentService.js')

module.exports = {
  postComment: (req, res) => {
    commentService.postComment(req, res, result => res.json(result))
  },

  deleteComment: async (req, res, cb) => {
    commentService.deleteComment(req, res, result => res.json(result))
  }
}