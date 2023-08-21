const jwt = require('jsonwebtoken')
const userService = require('../services/user.service');
const AppError = require('../errors/AppError');

async function verifyJWT(req, res, next) {
  const authorization = req.headers.authorization;
  const accessToken = authorization?.split(' ')[1]

  const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
  const findUser = await userService.findOne('username',decoded.username)
  if(!findUser) throw new AppError('Unauthorized',401)
  
  req.body = {
    ...req.body,
    user_id : findUser.id,
    username : findUser.username,
  }


  next()
}

module.exports = verifyJWT;
