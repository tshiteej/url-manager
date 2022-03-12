const Sequelize = require('sequelize')
const db = require('../config/database')

const Tokens = db.define('tokens', {
    user: {
        type: Sequelize.INTEGER
    },
    token: {
        type: Sequelize.STRING
    },
    active: {
        type: Sequelize.BOOLEAN
    }
})

module.exports = Tokens;