const ROLES = require("../../constants/roles");
const AppError = require("../../errors/AppError");
const commentService = require("../../services/comments.service");
const postService = require("../../services/posts.service");
const roleService = require("../../services/role.service");

const getAll = async (req, res) => {
  const data = await commentService.getAll();
  res.send(data);
};

const create = async (req, res) => {
  const { content, post_id, user_id } = req.body;
  if (!content) throw new AppError("Content mustbe string", 400);
  if (!post_id) throw new AppError("post_id must be string", 400);
  const findPost = await postService.findOne("id", post_id);
  if (!findPost) throw new AppError("Post not found", 400);
  await commentService.create(content, new Date(), null, user_id, post_id);
  res.send(201);
};

const update = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const findComments = await commentService.findOne("id", id);
  if (!findComments) throw new AppError("Comment not found", 404);

  await commentService.update(id, content || findComments.content, new Date());
  res.sendStatus(204);
};

const deleteComment = async (req, res) => {
  const { user_id } = req.body;
  const { id: idComment } = req.params;

  const findComment = await commentService.findOne("id", idComment);
  if (!findComment) throw new AppError("Comment not found", 404);
  const roleUser = await roleService.getRolesUser(user_id);

  const roles = roleUser.map((r) => r.role);

  const { user_id: userIdComments, post_id } = findComment;
  const findPost = await postService.findOne("id", post_id);

  if (!idComment) throw new AppError("ID comment is must required", 400);

  if (
    roles.find((role) => role === ROLES.ADMIN) ||
    findPost.user.id === user_id ||
    userIdComments === user_id
  ) {
    await commentService.deleteComment(idComment);
    res.send(200);
  } else {
    throw new AppError("Unauthorized", 401);
  }
};

const likeComment = async (req, res) => {
  const { user_id, idComment } = req.body;

  if (!idComment) throw new AppError("ID comment is must required", 400);

  await commentService.likeComments(idComment, user_id);
  res.json(200);
};

const unLikeComment = async (req, res) => {
  const { user_id, idComment } = req.body;

  if (!idComment) throw new AppError("ID comment is must required", 400);
  await commentService.unLikeComments(idComment, user_id);
  res.json(200);
};

module.exports = {
  getAll,
  create,
  update,
  likeComment,
  unLikeComment,
  deleteComment,
};
