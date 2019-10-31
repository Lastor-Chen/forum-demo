const express = require('express')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const db = require('./models')
const app = express()
const PORT = process.env.PORT || 3000
const HOST = process.env.HOSTNAME || 'localhost'

app.engine('hbs', exphbs({ extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'forum secret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

// ==============================
app.listen(PORT, () => {
  db.sequelize.sync()
  const mode = process.env.NODE_ENV || 'development'
  console.log(`\n[App] Using environment "${mode}".`)
  console.log(`[App] App is running on ${HOST}:${PORT}`)
})

require('./routes/index.js')(app)