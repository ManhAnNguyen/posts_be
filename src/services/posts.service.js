const db = require("./db.service");

const get = () =>
  db.query(
    `SELECT P.id,P.title,P.description,P.created_at,S_P.value as status,P.user_id,P.updated_at,
    json_object(
      'id',U.id,
      'username',U.username,
      'created_at',U.created_at
    ) as user
    FROM post as P 
    join statuspost as S_P 
    on P.status_id = S_P.id
    join users as U on U.id =P.user_id 
    `
  );



const create = async (title, desc, status_id, user_id) => {
  await db.query(
    `INSERT post (title,description,user_id,status_id,created_at) VALUES (?,?,?,?,?)`,
    [title, desc, user_id, status_id, new Date()]
  );
};

const findOne = async (key, value) => {
  const data = await db.query(`
  SELECT P.id,P.title,P.description,P.created_at,S_P.value as status,P.user_id,P.updated_at,
  json_object(
    'id',U.id,
    'username',U.username,
    'created_at',U.created_at
  ) as user
  FROM post as P 
  join statuspost as S_P 
  on P.status_id = S_P.id
  join users as U on U.id =P.user_id  WHERE P.${key} = ?`, [value]);
  return data[0];
};

const update = async (keys, values, keyCondition, valueCondition) => {
  let queryUpdate = "";
  keys.forEach((key, index) => {
    queryUpdate =
      queryUpdate + ` ${index === 0 ? "" : ","} ${key} = "${values[index]}"`;
  });

  await db.query(`UPDATE post SET ${queryUpdate} where ${keyCondition} = ? `, [
    valueCondition,
  ]);
};

const getStatusPost = async (value) => {
  const data = await db.query(`SELECT * FROM statuspost WHERE value = ? `, [
    value,
  ]);

  return data[0];
};

const deletePost = (id) => db.query(`DELETE FROM post WHERE id = ?`, [id]);

module.exports = { get, create, findOne, update, deletePost, getStatusPost };
