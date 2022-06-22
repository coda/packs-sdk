"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ALLOWED_GET_DOMAINS = exports.HttpStatusCode = void 0;
var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["Unauthorized"] = 401] = "Unauthorized";
})(HttpStatusCode = exports.HttpStatusCode || (exports.HttpStatusCode = {}));
exports.DEFAULT_ALLOWED_GET_DOMAINS = [
    'coda-us-west-2-prod-blobs-upload.s3.us-west-2.amazonaws.com',
    'coda-us-west-2-staging-blobs-upload.s3.us-west-2.amazonaws.com',
    'coda-us-west-2-head-blobs-upload.s3.us-west-2.amazonaws.com',
    'coda-us-west-2-adhoc-blobs-upload.s3.us-west-2.amazonaws.com',
    'coda-us-west-2-dev-blobs-upload.s3.us-west-2.amazonaws.com',
    'codahosted.io',
];
