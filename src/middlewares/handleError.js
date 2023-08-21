const AppError = require("../errors/AppError");

const errorHandle = (err, req, res, next) => {
  console.log("params : ", req.params);
  console.log("url : ", req.url);
  console.log("method : ", req.method);
  console.log("message : ", err.message);
  console.log("stack : ", err.stack);
  console.log("nameError : ", err.name);
  console.log("messageError : ", err.message);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  res.status(500).json({message : err.message})
};

module.exports = errorHandle;
