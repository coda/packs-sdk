"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
const util_1 = require("util");
class ConsoleLogger {
    _logMessage(level, message, args) {
        if (args.length) {
            // eslint-disable-next-line no-console
            console.log(`[${level}/${new Date().toISOString()}]: ${util_1.format(message, args)}`);
        }
        else {
            // eslint-disable-next-line no-console
            console.log(`[${level}/${new Date().toISOString()}]: ${message}`);
        }
    }
    trace(message, ...args) {
        this._logMessage('trace', message, args);
    }
    debug(message, ...args) {
        this._logMessage('debug', message, args);
    }
    info(message, ...args) {
        this._logMessage('info', message, args);
    }
    warn(message, ...args) {
        this._logMessage('warn', message, args);
    }
    error(message, ...args) {
        this._logMessage('error', message, args);
    }
}
exports.ConsoleLogger = ConsoleLogger;
