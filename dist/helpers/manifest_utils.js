"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ensure_1 = require("./ensure");
/** Corrects the JSON-serialized format and outputs one for runtime consumption. */
function deserializePackFormat(_a) {
    var { matchers } = _a, rest = __rest(_a, ["matchers"]);
    const regExpMatchers = matchers &&
        matchers.map(regExpString => {
            const [, pattern, flags] = ensure_1.ensureExists(regExpString.match(/\/(.*)\/([a-z]+)?/));
            return new RegExp(pattern, flags);
        });
    return Object.assign({}, rest, { matchers: regExpMatchers });
}
/** Corrects the JSON-serialized format and outputs one for runtime consumption. */
function deserializeExternalPackMetadata(rawMetadata) {
    const { formats } = rawMetadata, metadata = __rest(rawMetadata, ["formats"]);
    if (formats) {
        return Object.assign({ formats: formats.map(f => deserializePackFormat(f)) }, metadata);
    }
    return metadata;
}
exports.deserializeExternalPackMetadata = deserializeExternalPackMetadata;
