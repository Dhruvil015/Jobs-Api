const express = require('express')
const router = express.Router()
const authContoller = require('../../controllers/auth.controller') 

router.post('/register', authContoller.register)

router.post('/login', authContoller.login)

module.exports = router