const Tokens = require('./models/Tokens')

const jwt = require('jsonwebtoken');

// Save issued tokens
const saveToken = async (user, token) => {
    try {
        await Tokens.create({ user, token })
        return true
    } catch (err) {
        console.log(err, "ERR [UTILS - save Token]")
    }
}

// Check if token is valid
const checkToken = async (token) => {
    try {
        let entity = await Tokens.findOne({ where: { token } })
        if (!entity || !entity.active) return false
        return true
    } catch (err) {
        console.log(err, "ERR [UTILS - check Token]")
    }
}

// Deactive the token
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

// The user id for the token
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