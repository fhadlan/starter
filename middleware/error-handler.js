// const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "terjadi error di server",
  };

  /**
   * if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  } 
   */

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }

  if (err.name === "CastError") {
    customError.msg = `Job dengan id ${err.value} tidak ditemukan`;
    customError.statusCode = 404;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Email dengan ${err.keyValue.email} sudah terdaftar`;
    customError.statusCode = 400;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
