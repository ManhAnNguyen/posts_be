
const express = require('express')
const router = express.Router()
const registerController = require('../../controllers/users/registerController')

router.post('/',registerController)

module.exports = router