const winston = require('winston');
const expressWinston = require('express-winston');
const path = require("path");
const { IS_PRODUCTION, LOG_DIR } = require("./../config");
const accessLogTransports = []
const errorLogTransports = []


if(IS_PRODUCTION){
    accessLogTransports.push(
        new winston.transports.File({ filename: path.join(LOG_DIR,"access.log") })
    )
    errorLogTransports.push(
        new winston.transports.File({ filename: path.join(LOG_DIR,"error.log") })
    )
} else {
    accessLogTransports.push(
        new winston.transports.Console()
    )
    errorLogTransports.push(
        new winston.transports.Console()
    )
}

module.exports = {
    errorLogger: expressWinston.errorLogger({
        transports: errorLogTransports,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json(),
        ),
        meta: true,
        msg: "HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}",
        expressFormat: true,
        colorize: false,
        ignoreRoute: function (req, res) { return false; }
    }),
    accessLogger: expressWinston.logger({
        transports: accessLogTransports,
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json(),
        ),
        meta: true,
        msg: "HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}",
        expressFormat: true,
        colorize: false,
        ignoreRoute: function (req, res) { return false; }
    }),
    logger: {
        info: winston.createLogger({
            level: 'info',
            format: winston.format.logstash(),
            transports: accessLogTransports
        }).info,
        error: winston.createLogger({
            level: 'error',
            format: winston.format.logstash(),
            transports: errorLogTransports
        }).error
    }
}
