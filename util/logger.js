const {
    winston,
    createLogger,
    format
} = require('winston');
const {
    combine,
    timestamp,
    label,
    printf,
    prettyPrint
} = format;
const DailyRotateFile = require("winston-daily-rotate-file");
const loggingConfig = require('../config/logging');
const logger = createLogger({
    format: combine(
        timestamp({
            format: loggingConfig.log_date_format,
        }),
        prettyPrint()
    ),
    transports: [
        new DailyRotateFile({
            filename: loggingConfig.file_path,
            datePattern: loggingConfig.file_date_format,
            zippedArchive: loggingConfig.enable_zipped_archive,
            maxSize: loggingConfig.max_file_size,
            extension: loggingConfig.file_extension,
            options: { 
                immediate: true,
            }
        })
    ],
});
module.exports = logger;