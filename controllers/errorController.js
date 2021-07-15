const AppError = require("./../utils/appError");

const duplicateFieldsDB = (err) => {
  let value, key;
  if (err.keyValue.handle) {
    value = err.keyValue.handle;
    key = "handle";
  }
  if (err.keyValue.email) {
    value = err.keyValue.email;
    key = "email";
  }

  const message = ` ${value} already exists. Please use another ${key}.`;
  return new AppError(message, 400);
};

const validationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = errors.join(". ");
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR:", err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err);

    if (error.name === "MongoError" && error.code === 11000)
      error = duplicateFieldsDB(error);
    else if (error.name === "ValidationError") error = validationErrorDB(error);

    sendErrorProd(error, res);
  }
};
