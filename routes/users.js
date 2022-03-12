const express = require('express');
const router = express.Router();
const db = require('../config/database')
const Users = require('../models/User')

router.get('/', async (req,res) => {
    try{
        let users = await Users.findAll()
        console.log(users)
        res.sendStatus(200)
    }catch(err){
        console.log(err,"ERROR")
    }
})

module.exports = router;