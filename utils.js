const Sequelize = require('sequelize')
const db = require('./config/database')

const Tokens = require('./models/Tokens')

const jwt = require('jsonwebtoken');

const saveToken = async (user, token) => {
    try {
        await Tokens.create({ user, token })
        return true
    } catch (err) {
        console.log(err, "ERR [UTILS - save Token]")
    }
}

const checkToken = async (token) => {
    try {
        let entity = await Tokens.findOne({ where: { token } })
        if (!entity || !entity.active) return false
        return true
    } catch (err) {
        console.log(err, "ERR [UTILS - check Token]")
    }
}

const invalidateToken = async (token) => {
    try {
        Tokens.update(
            { active: false },
            { where: { token } }
        )
        return true
    } catch (err) {
        console.log(err, "ERR [UTILS - check Token]")
    }
}

const getUserFromToken = async (token) => {
    try {

        let data = await jwt.verify(token, process.env.JWT_SECRET)
        return data

    } catch (err) {
        console.log(err, "ERR [UTILS - check Token]")
    }
}

module.exports = {
    saveToken, checkToken, invalidateToken, getUserFromToken
}