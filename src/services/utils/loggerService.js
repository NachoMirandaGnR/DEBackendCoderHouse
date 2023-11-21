import winston from "winston";
import * as dotenv from "dotenv";
dotenv.config();

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "http",
    }),
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "warn ",
    }),
  ],
});
const devLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "verbose",
    }),
  ],
});

const prodLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "http",
    }),
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "warn",
    }),
  ],
});
export const addLogger = (req, res, next) => {
  req.logger = process.env.NODE_ENV === "development" ? devLogger : prodLogger;
  let { body } = req;
  let bodyData = { ...body };
  console.log(bodyData);
  if (req.method === "POST" || req.method === "PUT") {
    bodyData = JSON.stringify(req.body);
  } else {
    bodyData = "";
  }
  req.logger.http(`${req.method} ${req.url}`);
  next();
};
