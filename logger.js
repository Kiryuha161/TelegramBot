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

module.exports.errorLogger = function (error, functionName, project) {
    let logInfo = {
        project: project,
        timestamp: new Date(),
        functionName: functionName,
        level: 'error',
        message: error.message,
        stackTrace: error.stack
    };
    logger.error(JSON.stringify(logInfo));
};
module.exports.infoLogger = function (infoMessage, functionName, userName, lotId, site, question, project) {
    let logInfo = {
        project: project,
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
module.exports.warnLogger = function (warnMessage, functionName, project) {
    let logInfo = {
        project: project,
        timestamp: new Date(),
        functionName: functionName,
        level: 'warn',
        warning: warnMessage
    };
    logger.warn(JSON.stringify(logInfo));
};
module.exports.startLogger = function(startMessage, port, project) {
    let startInfo = {
        project: project,
        timestamp: new Date(),
        level: 'info',
        message: startMessage
    };

    logger.info(JSON.stringify(startInfo));
}

module.exports.chatLogger = function(startMessage, userMessage, project, site, answer) {
    let chatInfo = {
        project: project,
        timestamp: new Date(),
        level: 'info',
        message: startMessage,
        site: site,
        userMessage: userMessage,
        answer: answer
    }

    logger.info(JSON.stringify(chatInfo));
}

