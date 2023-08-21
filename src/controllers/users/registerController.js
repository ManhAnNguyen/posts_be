const bcrypt = require("bcrypt");
const userService = require("../../services/user.service");
const AppError = require("../../errors/AppError");
const roleService = require("../../services/role.service");
const ROLES = require("../../constants/roles");

const create = async (req, res) => {
  const { username, password: pwd } = req.body;
  if (!username || !pwd)
    throw new AppError("Username and password are requied", 400);
  const findOne = await userService.findOne("username", username);
  if (!!findOne) throw new AppError(`${username} is existing in db`, 409);
  const password = bcrypt.hashSync(pwd, +process.env.ROUND_HASH);
  const { insertId: id } = await userService.create(username, password);
  const defaultRoles= await roleService.findRoles(ROLES.USER) 
  await roleService.updateRole(id, defaultRoles.id);

  res.sendStatus(201);
};

module.exports = create;
