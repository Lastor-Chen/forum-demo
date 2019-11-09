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
    input.image = 'https://i.imgur.com/FYDQr43.jpg'

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

  getUser: async (req, res) => {
    try {
      const UserId = +req.params.id
      const isOwner = (req.user.id === UserId)
  
      const showUser = await User.findByPk(UserId)
      const result = await Comment.findAndCountAll({ where: { UserId }, include: Restaurant })
      const count = result.count
      const comments = result.rows
  
      res.render('user', { css: 'user', showUser, isOwner, count, comments })
    } catch (err) { res.status(422).json(err.toString()) }
  },

  editUser: (req, res) => {
    if (+req.params.id !== req.user.id ) {
      req.flash('error', '未具有相關權限')
      return res.redirect(`/users/${+req.params.id}`)
    }
    res.render('editUser')
  },

  putUser: async (req, res) => {
    let error = ''
    if (!req.body.name) { error = 'Name 不得為空' }
    if (+req.params.id !== req.user.id) { error = '未具有相關權限' }
    if (error) return res.render('editUser', { error })

    const input = req.body
    const { file } = req
    if (file) {
      imgur.setClientId(IMGUR_CLIENT_ID)
      try {
        const img = await imgur.uploadFile(file.path)
        input.image = img.data.link
      } catch (err) { console.error(err) }
    }

    try {
      const user = await User.findByPk(req.user.id)
      await user.update(input)
      req.flash('success', 'user profile was successfully updated')
      res.redirect(`/users/${req.user.id}`)
    } catch (err) { res.status(422).json(err.toString()) }
  },

  addFavorite: (req, res) => {
    Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.RestaurantId
    })
    .then(favorite => res.redirect('back'))
    .catch(err => res.status(422).json(err.toString()))
  },

  removeFavorite: async (req, res) => {
    try {
      const favorite = await Favorite.findOne({ where: {
        UserId: req.user.id,
        RestaurantId: req.params.RestaurantId
      }})
      
      await favorite.destroy()
      res.redirect('back')
    } catch (err) { res.status(422).json(err.toString()) }
  },

  addLike: (req, res) => {
    Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.RestaurantId
    })
      .then(like => res.redirect('back'))
      .catch(err => res.status(422).json(err.toString()))
  },

  removeLike: async (req, res) => {
    try {
      const like = await Like.findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.RestaurantId
        }
      })

      await like.destroy()
      res.redirect('back')
    } catch (err) { res.status(422).json(err.toString()) }
  },

  getTopUser: (req, res) => {
    User.findAll({ include: 'Followers' })
      .then(users => {
        users = users.map(user => {
          user.FollowerCount = user.Followers.length,
          user.isFollowed = req.user.Followings.some(v => v.id === user.id)
          return user
        })
        // 依 Follower數 排序
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
        res.render('topUsers', { users })
      })
      .catch(err => res.status(422).json(err.toString()))
  },

  addFollowing: (req, res) => {
    Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then(() => res.redirect('back'))
      .catch(err => res.status(422).json(err.toString()))
  },

  removeFollowing: (req, res) => {
    Followship.findOne({ where: {
      followerId: req.user.id,
      followingId: req.params.userId
    }})
      .then(followship => followship.destroy())
      .then(() => res.redirect('back'))
      .catch(err => res.status(422).json(err.toString()))
  }
}