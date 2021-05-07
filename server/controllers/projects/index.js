const Controller = require('./controller')

const models = {
  User: require('../../models/User'),
  Project: require('../../models/Project'),
}

module.exports = Controller(models)
