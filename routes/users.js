const express = require('express');
const router = express.Router();
const Users = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { saveToken } = require('../utils')

router.get('/', async (req, res) => {
    try {
        let users = await Users.findAll()
        res.sendStatus(200)
    } catch (err) {
        console.log(err, "ERROR")
    }
})

// @route    POST /user/register
// @desc     Register user
// @access   Public
router.post(
    '/register',
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await Users.findOne({ where: { email } }) || {}

            if (Object.keys(user).length) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'User already exists' }] });
            }

            user = req.body
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            let data = await Users.create(user)
            let userId = data.dataValues.id

            console.log(userId,"DATA")
            const payload = {
                user: {
                    id: userId
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '5 days' },
                (err, token) => {
                    if (err) throw err;
                    saveToken(userId, token)
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;