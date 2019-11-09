const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant

const localOption = {
  usernameField: 'email',
  passwordField: 'password'
}

passport.use(new LocalStrategy(localOption, (email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return done(null, false, { message: 'Email 或 Password 不符' })

        const success = bcrypt.compareSync(password, user.password)
        if (!success) return done(null, false, { message: 'Email 或 Password 不符' })
        
        done(null, user, { message: '成功登入' })
      })
      .catch(err => console.error(err))
  }
))

// 序列化 session
passport.serializeUser((user, done) => done(null, user.id))

// 反序列化 session
passport.deserializeUser((id, done) => {
  User.findByPk(id, { 
    include: [
      { model: Restaurant, as: 'FavoriteRestaurants' }
    ] 
  })
    .then(user => done(null, user))
})

module.exports = passport