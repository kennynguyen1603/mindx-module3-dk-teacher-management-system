import winston from 'winston';
import 'winston-daily-rotate-file';

class MyLogger {
  private logger: winston.Logger;

  constructor() {
    // Định dạng log cho Console (Dễ nhìn cho Dev)
    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf((info) => {
        const {
          level,
          message,
          context = '',
          requestId = '',
          timestamp = '',
          metadata = {},
        } = info;

        let metaStr = '';
        const meta = metadata as Record<string, any>;
        if (Object.keys(meta).length > 0) {
          metaStr = `\n${JSON.stringify(meta, null, 2)}`;
        }

        return `[${timestamp}] ${level} [${context}] [${requestId}]: ${message}${metaStr}`;
      }),
    );

    // Định dạng log cho File (Cấu trúc để máy đọc/grep)
    const fileFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf((info) => {
        const {
          level,
          message,
          context = '',
          requestId = '',
          timestamp = '',
          metadata = {},
        } = info;
        return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}`;
      }),
    );

    // Cấu hình chung cho DailyRotateFile
    const commonRotateConfig = {
      dirname: 'src/logs',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '1m',
      maxFiles: '14d',
      format: fileFormat,
    };

    this.logger = winston.createLogger({
      transports: [
        // Console transport với format riêng
        new winston.transports.Console({
          format: consoleFormat,
        }),

        // File transports với format chung cho file
        new winston.transports.DailyRotateFile({
          ...commonRotateConfig,
          filename: 'application-%DATE%.info.log',
          level: 'info',
        }),

        new winston.transports.DailyRotateFile({
          ...commonRotateConfig,
          filename: 'application-%DATE%.error.log',
          level: 'error',
        }),
      ],
    });
  }


  /**
   * Log info message
   * @param message - Log message
   * @param context - Context của log (vd: service name, function name)
   * @param requestId - ID của request
   * @param metadata - Thông tin bổ sung
   */
  public info(
    message: string,
    context: string = '',
    requestId: string = '',
    metadata: Record<string, any> = {},
  ): void {
    this.logger.info(message, { context, requestId, metadata });
  }

  /**
   * Log error message
   * @param message - Log message
   * @param context - Context của log (vd: service name, function name)
   * @param requestId - ID của request
   * @param metadata - Thông tin bổ sung
   */
  public error(
    message: string,
    context: string = '',
    requestId: string = '',
    metadata: Record<string, any> = {},
  ): void {
    this.logger.error(message, { context, requestId, metadata });
  }

  /**
   * Log warning message
   * @param message - Log message
   * @param context - Context của log (vd: service name, function name)
   * @param requestId - ID của request
   * @param metadata - Thông tin bổ sung
   */
  public warn(
    message: string,
    context: string = '',
    requestId: string = '',
    metadata: Record<string, any> = {},
  ): void {
    this.logger.warn(message, { context, requestId, metadata });
  }

  /**
   * Log debug message
   * @param message - Log message
   * @param context - Context của log (vd: service name, function name)
   * @param requestId - ID của request
   * @param metadata - Thông tin bổ sung
   */
  public debug(
    message: string,
    context: string = '',
    requestId: string = '',
    metadata: Record<string, any> = {},
  ): void {
    this.logger.debug(message, { context, requestId, metadata });
  }
}

export const logger = new MyLogger();

export type Logger = MyLogger;
