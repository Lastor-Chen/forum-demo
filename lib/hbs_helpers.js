const moment = require('moment')

module.exports = {
  ifEqual: function(arg1, arg2, options) {
    return (arg1 === arg2) ? options.fn(this) : options.inverse(this)
  },

  moment: function(date) {
    return moment(date).fromNow()
  }
}