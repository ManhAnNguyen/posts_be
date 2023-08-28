const AppError = require("../../errors/AppError");
const commentService = require("../../services/comments.service");
const postService = require("../../services/posts.service");

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

module.exports = { getAll, create, update };
