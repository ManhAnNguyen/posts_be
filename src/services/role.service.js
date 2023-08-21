const db = require("./db.service");

const getAll = () => db.query(`SELECT * FROM roles`);
const findRoles = async (value) => {
  const data = await db.query(`SELECT * FROM roles WHERE role = ?`, [value]);
  return data[0];
};
const getRolesUser = (user_id) =>
  db.query(
    `SELECT role FROM userroles join roles on userroles.id_role = roles.id WHERE id_user = ?`,
    [user_id]
  );

const getExistingUser = async (user_id, role) => {
  const data = await db.query(
    `SELECT * FROM userroles as U_R join roles as R  on U_R.id_role = R.id WHERE U_R.id_user = ? AND R.role = ?`,
    [user_id, role]
  );

  return data[0];
};

const updateRole = (user_id, role) =>
  db.query(`INSERT INTO userroles (id_user,id_role) values (?,?)`, [
    user_id,
    role,
  ]);

const removeUserRole = async (user_id, role_id) => {
  if (role_id) {
    await db.query(
      `
        DELETE FROM userroles   
        WHERE id_user = ? AND id_role = ?
      `,
      [user_id, role_id]
    );
  }
  else {
    await db.query(
      `
        DELETE FROM userroles   
        WHERE id_user = ?
      `,
      [user_id]
    );
  }
}


module.exports = {
  findRoles,
  getAll,
  getRolesUser,
  updateRole,
  getExistingUser,
  removeUserRole,
};
