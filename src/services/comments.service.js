const db = require("./db.service");

const getAll = () => db.query(`SELECT * FROM comments`);
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

module.exports = { getAll, create, findOne, update };
