const db = require("./db.service");

const get = () =>
  db.query(
    `SELECT U.id,U.username,U.created_at,R.role
    from users as U 
    left join userRoles as U_R on U.id = U_R.id_user
    left join roles as R on R.id = U_R.id_role
    WHERE U.isDeleted IS NOT TRUE

    `
  );

const create = async (username, password) => {
  const data = await db.query(
    `INSERT INTO users (username,password,created_at)  VALUES (?,?,?)`,
    [username, password, new Date()]
  );

  return data;
};

const findOne = async (key, value) => {
  const data = await db.query(
    `SELECT U.id,U.username,U.created_at,R.role
     from users as U 
     left join userRoles as U_R on U.id = U_R.id_user
     left join roles as R on R.id = U_R.id_role
     WHERE U.${key} = ? AND  U.isDeleted IS NOT TRUE
  `,
    [value]
  );
  return data[0];
};

const findAllUserOne = async (key, value) => {
  const data = await db.query(`SELECT * FROM users WHERE ${key} = ?`, [value]);
  return data[0];
};

const update = async (keys, values, keyCondition, valueCondition) => {
  let queryUpdate = "";
  keys.forEach(
    (key, index) =>
      (queryUpdate =
        queryUpdate + ` ${index === 0 ? "" : ","} ${key} = '${values[index]}'`)
  );

  await db.query(`UPDATE users SET ${queryUpdate} where ${keyCondition} = ? `, [
    valueCondition,
  ]);
};

const deleteUser = (id) =>
  db.query(
    `
    UPDATE  users SET isDeleted = true WHERE id = ? 
`,
    [id]
  );

module.exports = { get, create, deleteUser, findOne, update, findAllUserOne };
