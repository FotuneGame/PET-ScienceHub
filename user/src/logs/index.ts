import winston from "winston";
import path from "path";


export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: path.join(__dirname,'..','..', 'public','error.log'), level: 'error' }),
      new winston.transports.File({ filename: path.join(__dirname,'..','..', 'public','combined.log') }),
    ],
  });