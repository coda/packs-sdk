"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatingFetcher = void 0;
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const xml2js_1 = __importDefault(require("xml2js"));
const FetcherUserAgent = 'Coda-Server-Fetcher';
const MAX_CONTENT_LENGTH_BYTES = 25 * 1024 * 1024;
class AuthenticatingFetcher {
    constructor(authDef, credentials) {
        this._authDef = authDef;
        this._credentials = credentials;
    }
    fetch(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, headers, body, form } = this._applyAuthentication(request);
            const response = yield request_promise_native_1.default({
                url,
                method: request.method,
                headers: Object.assign(Object.assign({}, headers), { 'User-Agent': FetcherUserAgent }),
                body,
                form,
                encoding: request.isBinaryResponse ? null : undefined,
                resolveWithFullResponse: true,
                timeout: 60000,
                forever: true,
            });
            let responseBody = response.body;
            if (responseBody && responseBody.length >= MAX_CONTENT_LENGTH_BYTES) {
                throw new Error(`Response body is too large for Coda. Body is ${responseBody.length} bytes.`);
            }
            try {
                const contentType = response.headers['content-type'];
                if (contentType && contentType.includes('text/xml')) {
                    responseBody = yield xml2js_1.default.parseStringPromise(responseBody, { explicitRoot: false });
                }
                else {
                    responseBody = JSON.parse(responseBody);
                }
                // Do not inadvertently parse non-objects.
                if (typeof responseBody !== 'object') {
                    responseBody = response.body;
                }
            }
            catch (e) {
                // Ignore if we cannot parse.
            }
            const responseHeaders = Object.assign({}, response.headers);
            for (const key of Object.keys(responseHeaders)) {
                if (key.toLocaleLowerCase() === 'authorization') {
                    delete responseHeaders[key];
                }
            }
            return {
                status: response.statusCode,
                headers: responseHeaders,
                body: responseBody,
            };
        });
    }
    _applyAuthentication(_request) {
        switch (this._authDef.type) {
        }
        if (this._credentials) {
        }
        throw new Error('Not yet implemented');
    }
}
exports.AuthenticatingFetcher = AuthenticatingFetcher;
