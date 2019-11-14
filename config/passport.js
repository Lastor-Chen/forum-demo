const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJwt = require('passport-jwt')
const ExtractJwt = passportJwt.ExtractJwt
const JwtStrategy = passportJwt.Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

// route sign in
// ===================================
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
    include: [{ all: true, nested: false }]
  })
    .then(user => done(null, user))
})

// api sign in
// ===================================
const jwtOption = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JwtStrategy(jwtOption, async (jwt_payload, next) => {
  try {
    const user = await User.findByPk(jwt_payload.id, { include: [{ all: true, nested: false }] })

    if (!user) return next(null, false)
    next(null, user)

  } catch (err) { console.error(err) }
}))

module.exports = passport