"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCodaError = void 0;
function isCodaError(value) {
    return value && 'statusCode' in value && typeof value.statusCode === 'number' && value.statusCode >= 400;
}
exports.isCodaError = isCodaError;
