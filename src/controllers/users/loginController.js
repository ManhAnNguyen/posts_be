const AppError = require("../../errors/AppError");
const userService = require("../../services/user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = process.env;
const moment = require('moment')

const login = async (req, res) => {
  const { username, password } = req.body;


  if (!username || !password)
    throw new AppError("Username and password are required", 400);

  //check existing db;
  const findUser = (await userService.findAllUserOne('username',username));

  if (!findUser) throw new AppError("User not found", 400);


  const matchedPwd = bcrypt.compareSync(password, findUser.password);
  if (!matchedPwd) throw new AppError("Password is incorrect", 400);

  //create token
  const accessToken = jwt.sign(
    {
      username: findUser.username,
      id: findUser.id,
      role: findUser.role,
    },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: env.TOKEN_EXPIRED,
    }
  );

  //create refresh token
  const refreshToken = jwt.sign(
    {
      username: findUser.username,
      id: findUser.id,
      role: findUser.role,
    },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRED,
    }
  );


  //send refresh token via cookie and set into db

  await userService.update(['refreshToken'],[refreshToken],'username',username)

  res.cookie('refreshToken',refreshToken,{
    secure : true,
    httpOnly : true,
    expires : new Date(moment(new Date).add('day',1).toLocaleString())
  })
  //send token to client

  res.status(200).json(accessToken);
};

module.exports = login;
