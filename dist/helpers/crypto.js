"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeSha256 = void 0;
const sha_js_1 = __importDefault(require("sha.js"));
function computeSha256(dataToChecksum, encodeAsUtf8 = true) {
    return _computeSha256Impl(dataToChecksum, encodeAsUtf8, true);
}
exports.computeSha256 = computeSha256;
function _computeSha256Impl(dataToChecksum, encodeAsUtf8 = true, outputHex) {
    const hash = (0, sha_js_1.default)('sha256');
    if (typeof dataToChecksum === 'string' && encodeAsUtf8) {
        hash.update(dataToChecksum, 'utf8');
    }
    else {
        hash.update(dataToChecksum);
    }
    return outputHex ? hash.digest('hex') : hash.digest();
}
