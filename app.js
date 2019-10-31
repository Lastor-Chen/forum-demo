const express = require('express')
const exphbs = require('express-handlebars')
const db = require('./models')
const app = express()
const PORT = process.env.PORT || 3000
const HOST = process.env.HOSTNAME || 'localhost'

app.engine('hbs', exphbs({ extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

// ==============================
app.listen(PORT, () => {
  db.sequelize.sync()
  const mode = process.env.NODE_ENV || 'development'
  console.log(`\n[App] Using environment "${mode}".`)
  console.log(`[App] App is running on ${HOST}:${PORT}`)
})

require('./routes/index.js')(app)