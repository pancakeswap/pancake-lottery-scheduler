import winston from "winston";
import "winston-daily-rotate-file";

const transport = new winston.transports.DailyRotateFile({
  dirname: "logs",
  filename: "lottery-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
});

const logger = winston.createLogger({
  transports: [transport],
});

export default logger;
