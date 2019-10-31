const bcrypt = require('bcryptjs')
const User = require('../models').User

module.exports = {
  signUpPage: (req, res) => res.render('signUp'),

  signUp: (req, res) => {
    const input = { ...req.body }
    input.password = bcrypt.hashSync(input.password, 10)

    User.create(input)
      .then(user => res.redirect('signup'))
      .catch(err => res.status(422).json(err))
  }
}