const passport = require('../config/passport.js')

module.exports = {
  authenticate: passport.authenticate('jwt', { session: false }),

  isAuthedAdmin: (req, res, next) => {
    if (req.user) {
      if (req.user.isAdmin) return next()
      res.json({ status: 'error', message: 'permission denied' })
    } else {
      res.json({ status: 'error', message: 'permission denied' })
    }
  }
}