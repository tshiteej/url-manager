const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Shortcuts = require('../models/Shortcuts')
const auth = require('../middleware/auth');

const { check, validationResult } = require('express-validator');
const { getUserFromToken } = require('../utils')
const Op = Sequelize.Op;


// @route    GET /shortcut
// @desc     Get Shortcuts of a user
// @access   Private
router.get(
    '/',
    auth,
    async (req, res) => {
        try {

            let { q, _sort = [] } = req.query
            _sort = JSON.parse(_sort)

            if (!_sort.length) _sort = ['createdAt', 'DESC']

            console.log(q, "Q")
            const userData = await getUserFromToken(req.headers['x-auth-token'])
            const userId = userData.user.id

            let searchParams

            if (q) {
                searchParams = {
                    user: userId, active: true, [Op.or]: {
                        shortcut: { [Op.like]: '%' + q + '%' },
                        description: { [Op.like]: '%' + q + '%' },
                        tags: { [Op.like]: '%' + q + '%' }
                    }
                }
            } else {
                searchParams = {
                    user: userId, active: true
                }
            }
            // searchParams['order'] = [_sort]
            // order: [
            //     ['id', 'DESC'],
            //     ['name', 'ASC'],
            // ]
            console.log(searchParams, "searchParams")
            console.log(_sort, "_sort")
            const data = await Shortcuts.findAll({
                where: searchParams,
                order: [_sort]
            })
            let response = []
            data.forEach((item, i) => {
                response.push(item.dataValues)
            })

            res.send(response)
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route    POST /shortcuts
// @desc     Create Shortcut
// @access   Private
router.post(
    '/',
    check('user', 'User is required').exists(),
    check('shortcut', 'Shortcut is required').exists()
        .custom(value => !/\s/.test(value))
        .withMessage('No spaces are allowed in the shortcut'),
    check('complete_url', 'Complete URL is required').exists(),
    auth,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { user, shortcut, complete_url, description, tags } = req.body;

        // User can create a shortcut only for oneself
        let userData = await getUserFromToken(req.headers['x-auth-token'])
        let userId = userData.user.id

        if (req.body.user != userId) return res.status(400).json({ msg: 'You can only create shortcuts for yourself' });

        //Duplicate shortcuts can't be created
        let checkShortcut = await Shortcuts.findOne({ where: { user: req.body.user, shortcut: req.body.shortcut, active: true } })
        if (checkShortcut) return res.status(400).json({ msg: 'You cannot create duplicate shortcuts' });

        try {
            let entry = await Shortcuts.create({ user, shortcut, complete_url, description, tags })
            res.json(entry)
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);


// @route    DELETE /shortcuts/id
// @desc     Delete Shortcut
// @access   Private
router.delete(
    '/:id',
    auth,
    async (req, res) => {

        try {

            let id = req?.params?.id
            let entity = await Shortcuts.findOne({ where: { id, active: true } })

            console.log(entity, "ENTITY")
            if (!entity) return res.writeHead(400, {
                'Content-Length': Buffer.byteLength("Shortcut not found"),
                'Content-Type': 'application/json'
            })
                .end("Shortcut not found");
            // res.sendStatus(400).send({ msg: 'Shortcut not found' })

            let shortcutUser = entity.dataValues.user

            // User can delete a shortcut only for oneself
            let userData = await getUserFromToken(req.headers['x-auth-token'])
            let userId = userData.user.id

            if (shortcutUser != userId) return res.status(400).json({ msg: 'You can only delete your shortcuts' });

            console.log(id, "id")
            let entry = Shortcuts.update(
                { active: false },
                { where: { id } }
            )
            // console.log(entry,"entry")
            return res.json(entry)
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
