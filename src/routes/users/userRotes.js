const express = require('express')
const router = express.Router()
const userControllers = require('../../controllers/users/userControllers')
const verifyRole = require('../../middlewares/verifyRoles')

router.use(verifyRole(['ADMIN']))

router.get('/',userControllers.get)
router.get('/:id',userControllers.findOne)
router.delete('/:id',userControllers.deleteUser)
router.post('/update-role',userControllers.updateRole)
router.post('/remove-role',userControllers.removeRole)

module.exports = router