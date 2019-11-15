const db = require('../models')
const Comment = db.Comment

const { INTERNAL_SERVER_ERROR } = require('http-status-codes')
const commentService = require('./services/commentService.js')

module.exports = {
  postComment: (req, res) => {
    commentService.postComment(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)
      res.redirect('back')
    })
  },

  deleteComment: async (req, res) => {
    commentService.deleteComment(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)
      res.redirect('back')
    })
  }
}