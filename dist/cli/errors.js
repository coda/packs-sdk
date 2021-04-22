"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatError = exports.isCodaError = void 0;
const util_1 = __importDefault(require("util"));
function isCodaError(value) {
    return value && 'statusCode' in value && typeof value.statusCode === 'number' && value.statusCode >= 400;
}
exports.isCodaError = isCodaError;
function formatError(obj) {
    return util_1.default.inspect(obj, false, null, true);
}
exports.formatError = formatError;
