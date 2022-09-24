import winston, { format, createLogger, transports } from 'winston';
import { TransformableInfo } from 'logform';
import { inspect } from 'util';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Custom Winston logger
 */
@Injectable()
export class LoggerService extends Logger {
  private readonly logger: winston.Logger;

  constructor() {
    super();
    this.logger = this.instantiateLogger();
  }

  instantiateLogger(): winston.Logger {
    const logFormat = format.printf(
      (info: TransformableInfo) =>
        `${info.timestamp}.${info.level.toUpperCase()}: ${info.message}`,
    );
    const logger = createLogger({
      exceptionHandlers: [
        new transports.File({
          filename: 'logs/mirza.log',
        }),
      ],
      format: format.combine(format.timestamp(), logFormat),
      transports: [new transports.File({ filename: 'logs/mirza.log' })],
    });

    logger.exitOnError = false;

    logger.add(
      new transports.Console({
        format: format.simple(),
      }),
    );

    return logger;
  }

  /**
   * Log information
   * @param message log message
   * @param context log location
   * @param requestId request UUID
   * @param obj object to be logged
   */
  log(message: string, context: string, requestId = '', obj?: any): void {
    if (requestId) {
      requestId = `[${requestId}]`;
    }

    if (obj) {
      this.logger.info(
        `[${context}]${requestId} ${message} ${inspect(obj, { depth: null })}`,
      );
    } else {
      this.logger.info(`[${context}]${requestId} ${message}`);
    }
  }

  /**
   * Log error
   * @param message log message
   * @param context log location
   * @param requestId request UUID
   * @param obj object to be logged
   */
  error(message: string, context: string, requestId = '', obj?: any): void {
    if (requestId) {
      requestId = `[${requestId}]`;
    }

    if (obj) {
      this.logger.error(
        `[${context}]${requestId} ${message} ${inspect(obj, { depth: null })}`,
      );
    } else {
      this.logger.error(`[${context}]${requestId} ${message}`);
    }
  }

  /**
   * Log warning
   * @param message log message
   * @param context log location
   * @param requestId request UUID
   * @param obj object to be logged
   */
  warn(
    message: string,
    context: string,
    requestId?: string,
    obj?: any,
  ): winston.Logger {
    if (requestId) {
      requestId = `[${requestId}]`;
    }

    if (obj) {
      return this.logger.warn(
        `[${context}]${requestId} ${message} ${inspect(obj, { depth: null })}`,
      );
    }

    return this.logger.warn(`[${context}][${requestId}] ${message}`);
  }

  /**
   * Log debug information
   * @param message log message
   * @param context log location
   * @param requestId request UUID
   * @param obj object to be logged
   */
  debug(
    message: string,
    context: string,
    requestId?: string,
    obj?: any,
  ): winston.Logger {
    if (requestId) {
      requestId = `[${requestId}]`;
    }

    if (obj) {
      return this.logger.debug(
        `[${context}]${requestId} ${message} ${inspect(obj, { depth: null })}`,
      );
    }

    return this.logger.debug(`[${context}]${requestId} ${message}`);
  }

  /**
   * Log verbose information
   * @param message log message
   * @param context log location
   * @param requestId request UUID
   * @param obj object to be logged
   */
  verbose(
    message: string,
    context: string,
    requestId?: string,
    obj?: any,
  ): winston.Logger {
    if (requestId) {
      requestId = `[${requestId}]`;
    }

    if (obj) {
      return this.logger.verbose(
        `[${context}]${requestId} ${message} ${inspect(obj, { depth: null })}`,
      );
    }

    return this.logger.verbose(`[${context}]${requestId} ${message}`);
  }
}
