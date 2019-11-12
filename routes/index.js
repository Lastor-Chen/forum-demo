const router = require('./routes.js')
const apis = require('./apis.js')

// 只是想試一下花式，讓 app.js 宣過的 passport 直接過給 router 使用
module.exports = (app, passport) => {
  app.use('/', router(passport))
  app.use('/api', apis)
}