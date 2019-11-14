const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const { BAD_REQUEST, UNAUTHORIZED } = require('http-status-codes')
const jwt = require('jsonwebtoken')

module.exports = {
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body

      // 檢查 input 未填
      if (!email || !password) return res.status(BAD_REQUEST).json({ status: 'error', message: "required fields didn't exist" })

      // 確認帳密
      const user = await User.findOne({ where: { email } })
      const isSuccess = bcrypt.compareSync(password, user.password)
      if (!user || !isSuccess) return res.status(UNAUTHORIZED).json({ status: 'error', message: 'email or password match failed' })

      // 通過
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      res.json({ status: 'success', message: 'ok', token, user })

    } catch (err) {
      console.error(err.toString())
      res.json({ status: 'serverError', message: err.toString() })
    }
  }
}