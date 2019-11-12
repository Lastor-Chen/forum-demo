module.exports = {
  isAuthed: (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/signin')
    next()
  },

  isAuthedAdmin: (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/signin')
    if (req.user.isAdmin) return next()

    // 當非 admin 權限時
    try {
      // res.locals.success 不存在時會噴錯
      if (res.locals.success) { req.flash('success', res.locals.success)  } 
    }
    catch (err) { req.flash('error', 'You do not have Administrator access') }

    res.redirect('/restaurants')
  }
}