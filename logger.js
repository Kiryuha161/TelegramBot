var _a = require('log4js'), getLogger = _a.getLogger, configure = _a.configure;

configure({
    appenders: {
        console: { type: "console" }
    },
    categories: {
        default: {
            appenders: ["console"],
            level: 'all'
        }
    }
});

var logger = getLogger();

module.exports.errorLogger = function (error, functionName) {
    let logInfo = {
        project: "TelegramSupportBot",
        timestamp: new Date(),
        functionName: functionName,
        level: 'error',
        message: error.message,
        stackTrace: error.stack
    };
    logger.error(JSON.stringify(logInfo));
};
module.exports.infoLogger = function (infoMessage, functionName, userName, lotId, site, question) {
    let logInfo = {
        project: "TelegramSupportBot",
        timestamp: new Date(),
        functionName: functionName,
        level: 'info',
        message: infoMessage,
        userName: userName,
        lotId: lotId,
        site: site, 
        question: question
    };
    logger.info(JSON.stringify(logInfo));

};
module.exports.warnLogger = function (warnMessage, functionName) {
    let logInfo = {
        project: "TelegramSupportBot",
        timestamp: new Date(),
        functionName: functionName,
        level: 'warn',
        warning: warnMessage
    };
    logger.warn(JSON.stringify(logInfo));
};
module.exports.startLogger = function(startMessage, port) {
    let startInfo = {
        project: "TelegramSupportBot",
        timestamp: new Date(),
        level: 'info',
        message: startMessage
    };

    logger.info(JSON.stringify(startInfo));
}