const bcrypt = require('bcryptjs')
const User = require('../models').User

// custom module
const { checkSignUp } = require('../lib/checkForm.js')

module.exports = {
  signUpPage: (req, res) => res.render('signUp'),

  signUp: async (req, res) => {
    const input = { ...req.body }

    // 檢查表單
    const error = await checkSignUp(input)
    if (error.length) return res.render('signup', { input, error })

    // 註冊帳號
    input.password = bcrypt.hashSync(input.password, 10)

    User.create(input)
      .then(user => {
        req.flash('success', '成功註冊帳號')
        res.redirect('signin')
      })
      .catch(err => res.status(422).json(err))
  },

  signInPage: (req, res) => res.render('signin'),

  signIn: (req, res) => {
    req.flash('success', '成功登入')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success', '登出成功')
    req.logout()
    res.redirect('signin')
  } 
}