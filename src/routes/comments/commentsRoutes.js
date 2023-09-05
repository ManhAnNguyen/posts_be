const express = require("express");
const router = express.Router();
const commentsControllers = require("../../controllers/comments/commentsControllers");
const verifyJWT = require("../../middlewares/verifyJWT");

router.get("/", commentsControllers.getAll);

router.use(verifyJWT);
router.post("/", commentsControllers.create);
router.post("/:id", commentsControllers.update);
router.delete("/:id", commentsControllers.deleteComment);
router.patch("/like", commentsControllers.likeComment);
router.patch("/un-like", commentsControllers.unLikeComment);

module.exports = router;
