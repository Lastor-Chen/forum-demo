const bcrypt = require('bcryptjs')
const User = require('../models').User

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
  } 
}