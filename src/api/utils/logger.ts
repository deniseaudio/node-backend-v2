import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import winston from "winston";
import WinstonDaily from "winston-daily-rotate-file";

const logDir = join(process.cwd(), ".logs");

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

// Define log format
const logFormat = winston.format.printf(
  ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
);

// Log Levels:
// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat
  ),
  transports: [
    // Debug logs settings
    new WinstonDaily({
      level: "debug",
      datePattern: "YYYY-MM-DD",
      // Log file /logs/debug/*.log in save
      dirname: `${logDir}/debug`,
      filename: `%DATE%.log`,
      // 30 days saved
      maxFiles: 30,
      json: false,
      zippedArchive: true,
    }),

    // Error logs settings
    new WinstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      // Log file /logs/error/*.log in save
      dirname: `${logDir}/error`,
      filename: `%DATE%.log`,
      // 30 days saved
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.colorize()
    ),
  })
);

export const stream = {
  write: (message: string) => {
    logger.info(message.slice(0, Math.max(0, message.lastIndexOf("\n"))));
  },
};

if (process.env.NODE_ENV === "test") {
  logger.silent = true;
}
