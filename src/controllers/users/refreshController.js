const AppError = require("../../errors/AppError");
const userService = require("../../services/user.service");
const jwt = require("jsonwebtoken");

const refreshController = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  console.log(req);

  if (!refreshToken) throw new AppError("refreshToken is required", 400);
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const findUser = await userService.findOne("username", decoded.username);

  if (!findUser) throw new AppError("Not found refreshToken");

  const accessToken = jwt.sign(
    {
      username: findUser.username,
      id: findUser.id,
      role: findUser.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.TOKEN_EXPIRED,
    }
  );
  res.status(200).json(accessToken);
};
module.exports = refreshController;
