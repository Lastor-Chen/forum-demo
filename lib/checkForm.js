const User = require('../models').User

module.exports = {
  checkSignUp: async (input) => {
    // 確認未填
    const keys = Object.keys(input)
    const index = Object.values(input).indexOf('')
    if (index !== -1) return [`請填寫 ${keys[index]} 欄位`]

    // 確認密碼二次輸入
    if (input.password !== input.passwordCheck) return ['兩次密碼輸入不同']

    // 確認 email 註冊與否
    try { 
      const user = await User.findOne({ where: { email: input.email } })
      return user ? ['此 Email 已被註冊'] : []
    }
    catch (err) { 
      console.error(err)
      return [err]
    }
  }
}