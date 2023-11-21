import { enumErrors } from "../services/errors/customErrors.js";
export default (error, req, res, next) => {
  console.log("middlewate", error);
  switch (error.code) {
    case enumErrors.INVALID_TYPE_ERROR:
      res.send({
        status: "error",
        error: error.name,
      });
      break;
    case enumErrors.DATABASE_ERROR:
      res.send({
        status: "error",
        error: error.name,
      });
      break;
    case enumErrors.ROUTING_ERROR:
      res.send({
        status: "error",
        error: error.name,
      });
      break;
    default:
      enumErrors.NOT_FOUND_ERROR;
      res.send({
        status: "error",
        error: error.name,
      });
      break;

    case enumErrors.AUTHENTICATION_ERROR:
      res.send({
        status: "error",
        error: error.name,
      });
      break;
    case enumErrors.AUTHORIZATION_ERROR:
      res.send({
        status: "error",
        error: error.name,
      });
      break;
    case enumErrors.VALIDATION_ERROR:
      res.send({
        status: "error",
        error: error.name,
      });
      break;
    case enumErrors.DUPLICATE_KEY_ERROR:
      res.send({
        status: "error",
        error: error.name,
      });
      break;
  }
  next();
};
