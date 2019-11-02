module.exports = {
  isAuthed: (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/signin')
    next()
  },

  isAuthedAdmin: (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/signin')

    if (req.user.isAdmin) return next()
    res.redirect('/restaurants')
  }
}