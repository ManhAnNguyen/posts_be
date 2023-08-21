const express = require('express')
const router = express.Router()

router.get('/',require('../../controllers/users/refreshController'))

module.exports =  router