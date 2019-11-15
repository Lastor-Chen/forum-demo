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
      if (!user) return res.status(UNAUTHORIZED).json({ status: 'error', message: 'email or password match failed' })
      
      const isSuccess = bcrypt.compareSync(password, user.password)
      if (!isSuccess) return res.status(UNAUTHORIZED).json({ status: 'error', message: 'email or password match failed' })

      // 通過
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      res.json({ status: 'success', message: 'ok', token, user })

    } catch (err) {
      console.error(err.toString())
      res.json({ status: 'serverError', message: err.toString() })
    }
  },

  signUp: async (req, res) => {
    try {
      const input = { ...req.body }

      // 確認 password
      if (input.passwordCheck !== input.password) return res.json({ status: 'error', message: '兩次密碼輸入不同' })

      // 確認 email
      const hasUser = await User.findOne({ where: { email: req.body.email } })
      if (hasUser) return res.json({ status: 'error', message: '此 email 已被註冊'})

      // 通過
      input.password = bcrypt.hashSync(input.password, 10)
      const newUser = await User.create(input)
      res.json({ status: 'success', message: '成功註冊帳號！', newUser })
    }
    catch (err) {
        console.error(err.toString())
        res.json({ status: 'serverError', message: err.toString() })
    }
  }
}