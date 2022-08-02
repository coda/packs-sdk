"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeFetcher = exports.fetch = void 0;
const http_1 = require("http");
const https_1 = require("https");
const nodeFetch = __importStar(require("node-fetch"));
/**
 * A wrapper for fetch() that allows us to
 * (1) easily stub this out in tests, and
 * (2) includes these requests automatically in distributed tracing (not yet implemented)
 */
async function fetch(url, init) {
    return nodeFetch.default(url, init);
}
exports.fetch = fetch;
async function nodeFetcher(options) {
    const { method = 'GET', uri, qs, followRedirect = true, gzip = true, json, headers: rawHeaders = {}, form, body, timeout, forever, resolveWithFullResponse, resolveWithRawBody, encoding, ca, maxResponseSizeBytes, legacyBlankAcceptHeader, } = options;
    const init = {
        method,
        timeout,
        compress: gzip,
        size: maxResponseSizeBytes || 0,
    };
    if (!followRedirect) {
        init.follow = 0;
        init.redirect = 'manual';
    }
    if (forever || ca) {
        init.agent = uri.startsWith('http:')
            ? new http_1.Agent({ keepAlive: forever })
            : new https_1.Agent({ keepAlive: forever, ca });
    }
    const headers = Object.fromEntries(Object.entries(rawHeaders)
        .filter(([_key, value]) => {
        return typeof value !== 'undefined';
    })
        .map(([key, value]) => {
        return [key.toLowerCase(), value];
    }));
    if (json && !headers.accept) {
        headers.accept = 'application/json';
    }
    // Mimic request-promise behavior of not sending an Accept header; node-fetch sends */* by default, so we override
    // to empty.
    if (legacyBlankAcceptHeader && !headers.accept) {
        headers.accept = '';
    }
    if (form) {
        const formParams = new URLSearchParams();
        for (const [key, value] of Object.entries(form)) {
            formParams.append(key, value.toString());
        }
        init.body = formParams;
    }
    else if (body) {
        if (json && !headers['content-type']) {
            headers['content-type'] = 'application/json';
        }
        if (typeof body !== 'string' && !Buffer.isBuffer(body)) {
            init.body = JSON.stringify(body);
        }
        else {
            init.body = body;
        }
    }
    init.headers = headers;
    const url = new URL(uri);
    if (qs) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(qs)) {
            queryParams.append(key, value.toString());
        }
        url.search = queryParams.toString();
    }
    const response = await fetch(url.href, init);
    const resultBody = await getResultBody(response, { encoding, resolveWithRawBody, forceJsonResponseBody: json });
    const fullResponse = {
        statusCode: response.status,
        statusMessage: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: resultBody,
    };
    if (resolveWithFullResponse) {
        return fullResponse;
    }
    return resultBody;
}
exports.nodeFetcher = nodeFetcher;
async function getResultBody(response, { encoding, resolveWithRawBody, forceJsonResponseBody, }) {
    var _a;
    if (resolveWithRawBody) {
        return response.body;
    }
    if (encoding === null) {
        return response.buffer();
    }
    if (forceJsonResponseBody || ((_a = response.headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.includes('application/json'))) {
        const body = await response.text();
        try {
            return JSON.parse(body);
        }
        catch (_err) {
            return body;
        }
    }
    return response.text();
}
