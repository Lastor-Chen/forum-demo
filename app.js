const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const PORT = process.env.PORT || 3000
const HOST = process.env.HOSTNAME || 'localhost'

app.engine('hbs', exphbs({ extname: 'hbs' }))
app.set('view engine', 'hbs')

// ==============================
app.listen(PORT, () => {
  const mode = process.env.NODE_ENV || 'development'
  console.log(`\n[App] Using environment "${mode}".`)
  console.log(`[App] App is running on ${HOST}:${PORT}`)
})