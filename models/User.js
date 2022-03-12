const Sequelize = require('sequelize')
const db = require('../config/database')

const Users = db.define('users', {
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    fname: {
        type: Sequelize.STRING
    },
    lname: {
        type: Sequelize.STRING
    },
})

module.exports = Users;