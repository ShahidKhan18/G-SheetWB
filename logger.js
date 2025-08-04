const { createLogger, format, transports } = require("winston");
const path = require("path");
const fs = require("fs");

const logDir = "logs";
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Custom filter to allow only specific level logs
const filterOnly = (level) =>
    format((info) => (info.level === level ? info : false))();

const logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new transports.File({
            filename: path.join(logDir, "error.json"),
            format: format.combine(
                filterOnly("error"),
                format.timestamp(),
                format.json()
            ),
        }),
        new transports.File({
            filename: path.join(logDir, "warns.json"),
            format: format.combine(
                filterOnly("warn"),
                format.timestamp(),
                format.json()
            ),
        }),
        new transports.File({
            filename: path.join(logDir, "info.json"),
            format: format.combine(
                filterOnly("info"),
                format.timestamp(),
                format.json()
            ),
        }),
    ],
});

module.exports = logger;
