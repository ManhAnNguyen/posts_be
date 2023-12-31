const db = require("./db.service");

const getAll = () =>
  db.query(`
  SELECT
  C.id as id,
  C.content as content,
  C.created_at as createdAt,
  C.updated_at as updatedAt,
  C.user_id as userId,
  C.post_id as postId
  , (
    select count(*) 
    from likeComments 
    join users on users.id = likeComments.id_user
    WHERE id_comment = C.id
    AND users.isDeleted IS NOT TRUE
 ) as totalLike 
  FROM comments  as C
  join users as U
  on C.user_id = U.id
  WHERE U.isDeleted IS NOT TRUE
 `);
const create = (content, created_at, update_at, user_id, post_id) =>
  db.query(
    `INSERT INTO comments  (content,created_at,updated_at,user_id,post_id) values (?,?,?,?,?)`,
    [content, created_at, update_at, user_id, post_id]
  );

const findOne = async (key, value) => {
  const data = await db.query(`SELECT * FROM comments where ${key} = ?`, [
    value,
  ]);
  return data[0];
};

const update = (post_id, content, updated_at) =>
  db.query(`UPDATE comments SET content = ?,updated_at = ? WHERE id = ?`, [
    content,
    updated_at,
    post_id,
  ]);

const likeComments = (id_comment, id_user) =>
  db.query(`INSERT INTO likeComments (id_comment,id_user) VALUES (?,?)`, [
    id_comment,
    id_user,
  ]);

const unLikeComments = (id_comment, id_user) =>
  db.query(`DELETE FROM likeComments WHERE  id_comment = ? AND id_user = ?`, [
    id_comment,
    id_user,
  ]);

const deleteComment = async (id_comment) => {
  await db.query(
    `
    DELETE FROM likeComments WHERE id_comment = ?
    `,
    [id_comment]
  );
  await db.query(
    `
    DELETE FROM comments WHERE id = ?
    `,
    [id_comment]
  );
};

module.exports = {
  getAll,
  create,
  findOne,
  update,
  likeComments,
  unLikeComments,
  deleteComment,
};
