"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBuffer = exports.isReadableStream = void 0;
const promise = __importStar(require("./promise"));
const stream_1 = __importDefault(require("stream"));
function isReadableStream(stream) {
    return stream instanceof stream_1.default.Readable || stream instanceof stream_1.default.Duplex;
}
exports.isReadableStream = isReadableStream;
async function toBuffer(stream, maxBytes = 0) {
    const bufs = [];
    const defer = promise.defer();
    function onEnd() {
        stream.destroy();
        let buf = Buffer.concat(bufs);
        if (maxBytes) {
            buf = buf.slice(0, maxBytes);
        }
        defer.fulfill(buf);
    }
    let count = 0;
    stream.on('data', buffer => {
        if (typeof buffer === 'string') {
            bufs.push(Buffer.from(buffer));
        }
        else {
            bufs.push(buffer);
        }
        count += buffer.length;
        if (maxBytes && count >= maxBytes) {
            onEnd();
        }
    });
    stream.on('end', () => onEnd());
    stream.on('error', err => defer.reject(err));
    return defer.promise;
}
exports.toBuffer = toBuffer;
