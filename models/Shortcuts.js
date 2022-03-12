const Sequelize = require('sequelize')
const db = require('../config/database')

const Shortcuts = db.define('shortcuts', {
    user: {
        type: Sequelize.INTEGER
    },
    shortcut: {
        type: Sequelize.STRING
    },
    complete_url: {
        type: Sequelize.BOOLEAN
    }
})

module.exports = Shortcuts;