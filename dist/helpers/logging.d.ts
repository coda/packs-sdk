import type { Logger } from '../api';
import type { LoggerParamType } from '../index';
export declare class ConsoleLogger implements Logger {
    private _logMessage;
    trace(message: string, ...args: LoggerParamType[]): void;
    debug(message: string, ...args: LoggerParamType[]): void;
    info(message: string, ...args: LoggerParamType[]): void;
    warn(message: string, ...args: LoggerParamType[]): void;
    error(message: string, ...args: LoggerParamType[]): void;
}
