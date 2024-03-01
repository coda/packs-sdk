"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ALLOWED_GET_DOMAINS_REGEXES = exports.HttpStatusCode = void 0;
var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["Unauthorized"] = 401] = "Unauthorized";
})(HttpStatusCode || (exports.HttpStatusCode = HttpStatusCode = {}));
// Note that this should be kept in sync with the "PacksAllowedPublicDomains" runtime config 
exports.DEFAULT_ALLOWED_GET_DOMAINS_REGEXES = [
    /^coda-us-west-2-\w+-blobs-upload\.s3\.us-west-2\.amazonaws\.com$/,
    /^codahosted\.io$/,
];
