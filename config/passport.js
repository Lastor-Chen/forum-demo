const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const User = require('../models').User

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return done(null, false, req.flash('error', '帳號或密碼輸入錯誤'))
        if (!bcrypt.compareSync(password, user.password)) return done(null, false, req.flash('error', '帳號或密碼輸入錯誤'))
        return done(null, user)
      })
  }
))

// 序列化 session
passport.serializeUser((user, done) => done(null, user.id))

// 反序列化 session
passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => done(null, user))
})

module.exports = passport