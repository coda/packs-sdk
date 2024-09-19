"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ALLOWED_GET_DOMAINS_REGEXES = void 0;
// Note that this should be kept in sync with the "PacksAllowedPublicDomains" runtime config
exports.DEFAULT_ALLOWED_GET_DOMAINS_REGEXES = [
    /^coda-us-west-2-\w+-blobs-upload\.s3\.us-west-2\.amazonaws\.com$/,
    /^codahosted\.io$/,
];
