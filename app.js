const express = require('express')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport.js')
const methodOverride = require('method-override')
const db = require('./models')
const app = express()
const PORT = process.env.PORT || 3000
const HOST = process.env.HOSTNAME || 'localhost'

if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

app.engine('hbs', exphbs({ 
  extname: 'hbs',
  helpers: require('./lib/hbs_helpers.js') 
}))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))
app.use(session({
  secret: 'forum secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

// ==============================
app.listen(PORT, () => {
  const mode = process.env.NODE_ENV || 'development'
  console.log(`\n[App] Using environment "${mode}".`)
  console.log(`[App] App is running on ${HOST}:${PORT}`)
})

require('./routes/index.js')(app, passport)