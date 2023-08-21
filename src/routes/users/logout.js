const express= require('express')
const router = express.Router()
const logoutController = require('../../controllers/users/logoutController')

router.delete('/',logoutController)

module.exports  = router