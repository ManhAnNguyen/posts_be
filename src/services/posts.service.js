const db = require("./db.service");

const get = () =>
  db.query(
    `SELECT P.id,P.title,P.description,P.created_at,S_P.value as status,P.user_id,P.updated_at,
    json_object(
      'id',U.id,
      'username',U.username,
      'created_at',U.created_at
    ) as user,
    (select  count(F_P.post_id ) from favoritePosts as F_P where F_P.post_id = P.id group by F_P.post_id  ) as totalLike
    FROM posts as P 
    join postStatus as S_P 
    on P.status_id = S_P.id
    join users as U on U.id =P.user_id ;
    `
  );

const create = async (title, desc, status_id, user_id) => {
  await db.query(
    `INSERT posts (title,description,user_id,status_id,created_at) VALUES (?,?,?,?,?)`,
    [title, desc, user_id, status_id, new Date()]
  );
};

const findOne = async (key, value) => {
  const data = await db.query(
    `
  SELECT P.id,P.title,P.description,P.created_at,S_P.value as status,P.user_id,P.updated_at,
  json_object(
    'id',U.id,
    'username',U.username,
    'created_at',U.created_at
  ) as user,
  (select  count(F_P.post_id ) from favoritePosts as F_P where F_P.post_id = P.id group by F_P.post_id  ) as totalLike

  FROM posts as P 
  join postStatus as S_P 
  on P.status_id = S_P.id
  join users as U on U.id =P.user_id  WHERE P.${key} = ?`,
    [value]
  );
  return data[0];
};

const update = async (keys, values, keyCondition, valueCondition) => {
  let queryUpdate = "";
  keys.forEach((key, index) => {
    queryUpdate =
      queryUpdate + ` ${index === 0 ? "" : ","} ${key} = "${values[index]}"`;
  });

  await db.query(`UPDATE posts SET ${queryUpdate} where ${keyCondition} = ? `, [
    valueCondition,
  ]);
};

const getStatusPost = async (value) => {
  const data = await db.query(`SELECT * FROM postStatus WHERE value = ? `, [
    value,
  ]);

  return data[0];
};

const deletePost = async (id) => {
  await db.query(`DELETE FROM favoritePosts where post_id = ?`, [id]);
  await db.query(`DELETE FROM posts WHERE id = ?`, [id]);
};

const likePost = (userId, postId, createdd_at) =>
  db.query(
    `INSERT INTO favoritePosts  (user_id,post_id,created_at) VALUES (?,?,?)`,
    [userId, postId, createdd_at]
  );

const unlikePost = (userId, postId) =>
  db.query(`DELETE FROM favoritePosts where user_id = ? AND post_id = ?`, [
    userId,
    postId,
  ]);

module.exports = {
  get,
  create,
  findOne,
  update,
  deletePost,
  getStatusPost,
  likePost,
  unlikePost,
};
