const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const { UNAUTHORIZED } = require('http-status-codes')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

module.exports = {
  signIn: async (req, res) => {
    try {
      const email = req.body.email
      const password = req.body.password

      // 檢查 input 未填
      if (!email || !password) return res.json({ status: 'error', message: "required fields didn't exist" })

      // 確認帳號
      const user = await User.findOne({ where: { email } })
      if (!user) return res.status(UNAUTHORIZED).json({ status: 'error', message: 'no such user found' })

      // 確認密碼
      const isSuccess = bcrypt.compareSync(password, user.password)
      if (!isSuccess) return res.status(UNAUTHORIZED).json({ status: 'error', message: 'password did not match' })

      // pass
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      res.json({ status: 'success', message: 'ok', token, user })

    } catch (err) {
      console.error(err.toString())
      res.json({ status: 'serverError', message: err.toString() })
    }
  }
}