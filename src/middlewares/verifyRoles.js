const AppError = require("../errors/AppError");
const rolesService = require("../services/role.service");

const verifyRoles = (roles) => async (req, res, next) => {
  const userRole = await rolesService.getRolesUser(req.body.user_id);

  const authorized = roles.every((role) =>
    userRole.map((r) => r.role).includes(role)
  );

  if (!authorized) throw new AppError("Unauthorized", 401);
  next();
};

module.exports = verifyRoles;
