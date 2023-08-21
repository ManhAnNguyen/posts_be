const AppError = require("../../errors/AppError");
const userService = require("../../services/user.service");
const roleService = require("../../services/role.service");

const get = async (req, res) => {
  const data = await userService.get();

  res.send(data);
};

const findOne = async (req, res) => {
  const { id } = req.params;

  if (!id) throw new Error("ID is required", 400);
  const findUser = await userService.findOne("id", id);
  if (!findUser) throw new AppError("Not found", 404);
  res.status(200).send(findUser);
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) throw new Error("ID is required", 400);
  const findUser = await userService.findOne("id", id);
  if (!findUser) throw new AppError("Not found", 404);
  await roleService.removeUserRole(id);
  await userService.deleteUser(id);
  res.sendStatus(202);
};

const updateRole = async (req, res) => {
  const { id, role } = req.body;

  if (!id || !role) throw new AppError("id and role is must be required", 400);
  const availableRole = await roleService.findRoles(role);
  const findUser = await userService.findOne("id", id);

  if (!findUser) throw new AppError(`User ID ${id} not found`, 404);

  if (!availableRole) throw new AppError("not available role", 400);
  const existingRole = await roleService.getExistingUser(id, role);
  if (!!existingRole) throw new AppError(`user has been role : ${role}`, 400);

  await roleService.updateRole(id, availableRole.id);
  res.sendStatus(200);
};

const removeRole = async (req, res) => {
  const { id, role } = req.body;
  if (!id) throw new AppError("ID is required", 400);
  const findUser = await userService.findOne("id", id);

  if (!findUser) throw new AppError(`User ID ${id} not found`, 404);
  if (!role) {
    await roleService.removeUserRole(id);
  } else {
    const availableRole = await roleService.findRoles(role);
    if(!availableRole) throw new AppError('Not available role',400)
    await roleService.removeUserRole(id,availableRole.id)
  }
  res.sendStatus(200);
};

module.exports = { get, findOne, deleteUser, updateRole, removeRole };
