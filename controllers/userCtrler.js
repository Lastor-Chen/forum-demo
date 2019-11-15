const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Followship = db.Followship
const Like = db.Like
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const { INTERNAL_SERVER_ERROR } = require('http-status-codes')
const userService = require('./services/userService.js')

// custom module
const { checkSignUp } = require('../lib/checkForm.js')

module.exports = {
  signUpPage: (req, res) => res.render('signup'),

  signUp: async (req, res) => {
    const input = { ...req.body }

    // 檢查表單
    const error = await checkSignUp(input)
    if (error.length) return res.render('signup', { input, error })

    // 註冊帳號
    input.password = bcrypt.hashSync(input.password, 10)
    input.image = '/img/user2.jpg'   // 預設圖片

    User.create(input)
      .then(user => {
        req.flash('success', '成功註冊帳號')
        res.redirect('signin')
      })
      .catch(err => res.status(422).json(err))
  },

  signInPage: (req, res) => res.render('signin'),

  signIn: (passport, req, res, next) => {
    const option = {
      badRequestMessage: '請輸入 Email 與 Password' 
    }
    passport.authenticate('local', option, (err, user, info) => {
      if (err) return res.json(err)

      const email = req.body.email
      const msg = info.message
      if (!user) return res.render('signin', { email, error: msg })

      req.logIn(user, err => {
        if (err) return res.json(err)
        req.flash('success', msg)
        res.redirect('/restaurants')
      })
    })(req, res, next)
  },

  logout: (req, res) => {
    req.flash('success', '登出成功')
    req.logout()
    res.redirect('signin')
  },

  getUser: (req, res) => {
    userService.getUser(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)
      res.render('user', result)
    })
  },

  editUser: (req, res) => {
    if (+req.params.id !== req.user.id ) {
      req.flash('error', '未具有相關權限')
      return res.redirect(`/users/${+req.params.id}`)
    }
    res.render('editUser')
  },

  putUser: (req, res) => {
    userService.putUser(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)

      req.flash(result.status, result.message)
      if (result.message.includes('Name')) return res.redirect(`/users/${req.user.id}/edit`)
      
      res.redirect(`/users/${req.user.id}`)
    })
  },
  
  addFavorite: (req, res) => {
    userService.addFavorite(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)
      res.redirect('back')
    })
  },

  removeFavorite: (req, res) => {
    userService.removeFavorite(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)
      res.redirect('back')
    })
  },

  addLike: (req, res) => {
    userService.addLike(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)
      res.redirect('back')
    })
  },

  removeLike: (req, res) => {
    userService.removeLike(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)
      res.redirect('back')
    })
  },

  getTopUser: (req, res) => {
    userService.getTopUser(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)
      res.render('topUsers', result)
    })
  },

  addFollowing: (req, res) => {
    userService.addFollowing(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)
      res.redirect('back')
    })
  },

  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, result => {
      if (result.status === 'serverError') return res.status(INTERNAL_SERVER_ERROR).json(result)
      res.redirect('back')
    })
  }
}