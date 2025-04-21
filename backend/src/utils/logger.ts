import { createLogger, format, transports } from 'winston';

enum LogLevels {
    INFO = "info",
    ERROR = "error",
    WARN = "warn"
}

const logger = createLogger({
    level: LogLevels.INFO,
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json()
    ),
    defaultMeta: { service: 'gilberts-hotel' },
    transports: [
        new transports.Console({
        format: format.combine(format.colorize(), format.simple())
        }),

        // File transport for persistent logging
        new transports.File({ filename: 'logs/error.log', level: LogLevels.ERROR }),
        new transports.File({ filename: 'logs/warn.log', level: LogLevels.WARN }),
        new transports.File({ filename: 'logs/combined.log' })
    ]
});

export default logger;