import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;
  private errorLogger: winston.Logger; 

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        // new winston.transports.Console(),

        new winston.transports.File({
          filename: 'logs/app.log',
          level: 'info'
        }),
      ],
    });

    this.errorLogger = winston.createLogger({
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error'
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.errorLogger.error({ message, trace });
  }
}
