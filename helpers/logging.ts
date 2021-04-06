import type {Logger} from '../api';
import type {LoggerParamType} from '../index';
import {format} from 'util';

export class ConsoleLogger implements Logger {
  private _logMessage(level: string, message: string, args: LoggerParamType[]) {
    if (args.length) {
      // eslint-disable-next-line no-console
      console.log(`[${level}/${new Date().toISOString()}]: ${format(message, args)}`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`[${level}/${new Date().toISOString()}]: ${message}`);
    }
  }

  trace(message: string, ...args: LoggerParamType[]): void {
    this._logMessage('trace', message, args);
  }

  debug(message: string, ...args: LoggerParamType[]): void {
    this._logMessage('debug', message, args);
  }

  info(message: string, ...args: LoggerParamType[]): void {
    this._logMessage('info', message, args);
  }

  warn(message: string, ...args: LoggerParamType[]): void {
    this._logMessage('warn', message, args);
  }

  error(message: string, ...args: LoggerParamType[]): void {
    this._logMessage('error', message, args);
  }
}
