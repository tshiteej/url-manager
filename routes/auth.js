const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const { saveToken, invalidateToken } = require('../utils')

const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route    GET /auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findOne({ attributes: { exclude: ['password'] }, where: req.user.id })
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route    GET /auth/logout
// @desc     Invalidate user Token
// @access   Private
router.get('/logout', auth, async (req, res) => {
    try {
        const value = await invalidateToken(req.headers['x-auth-token'])
        console.log(value,"VALUE")
        res.sendStatus(200);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route    POST /auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post(
    '/login',
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ where: { email } });

            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Email not found' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '5 days' },
                (err, token) => {
                    if (err) throw err;
                    saveToken(user.id, token)
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