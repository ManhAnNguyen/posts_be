const express = require('express')
const router = express.Router()
const postController = require('../../controllers/posts/postController')
const verifyJWT = require('../../middlewares/verifyJWT')
const verifyRoles = require('../../middlewares/verifyRoles')
const ROLES = require('../../constants/roles')

router.get('/',postController.getAll)
router.get('/:id',postController.getOne)

//verify jwt
router.use(verifyJWT)
router.post('/',postController.create)
router.post('/:id',postController.updateOne)
router.delete('/:id',postController.deletePost)

//verify role
router.post('/change-status/:id',verifyRoles([ROLES.ADMIN]),postController.changeStatus)
// router.post('/:id',)

module.exports = router