"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs_1 = __importDefault(require("qs"));
const url_parse_1 = __importDefault(require("url-parse"));
function withQueryParams(url, params) {
    if (!params) {
        return url;
    }
    const parsedUrl = url_parse_1.default(url);
    // Merge the params together
    const updatedParams = Object.assign({}, qs_1.default.parse(parsedUrl.query, { ignoreQueryPrefix: true }), params);
    parsedUrl.set('query', qs_1.default.stringify(JSON.parse(JSON.stringify(updatedParams)), { addQueryPrefix: true }));
    return parsedUrl.toString();
}
exports.withQueryParams = withQueryParams;
