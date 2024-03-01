"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newFetcherSyncExecutionContext = exports.newFetcherExecutionContext = exports.requestHelper = exports.AuthenticatingFetcher = void 0;
const client_sts_1 = require("@aws-sdk/client-sts");
const types_1 = require("../types");
const constants_1 = require("./constants");
const constants_2 = require("./constants");
const client_sts_2 = require("@aws-sdk/client-sts");
const sha256_js_1 = require("@aws-crypto/sha256-js");
const signature_v4_1 = require("@aws-sdk/signature-v4");
const url_1 = require("url");
const ensure_1 = require("../helpers/ensure");
const ensure_2 = require("../helpers/ensure");
const ensure_3 = require("../helpers/ensure");
const ensure_4 = require("../helpers/ensure");
const helpers_1 = require("./helpers");
const node_fetcher_1 = require("./node_fetcher");
const oauth_helpers_1 = require("./oauth_helpers");
const helpers_2 = require("./helpers");
const url_parse_1 = __importDefault(require("url-parse"));
const uuid_1 = require("uuid");
const xml2js_1 = __importDefault(require("xml2js"));
const FetcherUserAgent = 'Coda-Test-Server-Fetcher';
const MaxContentLengthBytes = 25 * 1024 * 1024;
const HeadersToStrip = ['authorization'];
function getTemplateReplacementValueForKey(key, invocationToken) {
    return `{{${key}-${invocationToken}}}`;
}
// NOTE(spencer): this becomes available in the string prototype with ES2021. Remove
// and migrate over when we change to that target.
// Mirrors our utility replaceAll function in `coda` repo.
function replaceAll(str, find, replace) {
    return str.split(find).join(replace);
}
class AuthenticatingFetcher {
    constructor(updateCredentialsCallback, authDef, networkDomains, credentials, invocationToken) {
        this._updateCredentialsCallback = updateCredentialsCallback;
        this._authDef = authDef;
        this._networkDomains = networkDomains;
        this._credentials = credentials;
        this._invocationToken = invocationToken;
    }
    async fetch(request, isRetry) {
        var _a;
        const { url, headers, body, form } = await this._applyAuthentication(request);
        this._validateHost(url, request.method);
        let response;
        try {
            response = await exports.requestHelper.makeRequest({
                uri: url,
                method: request.method,
                encoding: request.isBinaryResponse ? null : undefined,
                headers: {
                    ...headers,
                    'User-Agent': FetcherUserAgent,
                },
                body,
                resolveWithFullResponse: true,
                form,
                followRedirect: !request.ignoreRedirects,
                throwOnRedirect: false,
                // Omitting maxResponseSizeBytes since some packs are permitted larger values
                // in production.
            });
        }
        catch (requestFailure) {
            // Only attempt 1 retry
            if (isRetry) {
                throw requestFailure;
            }
            // If OAuth had a 401 error, that should mean invalid token (RFC 6750), which could be
            // an expired token. Let's assume that it is and retry the request after
            // refreshing the auth token.
            if (!this._isOAuth401(requestFailure)) {
                throw requestFailure;
            }
            (0, helpers_2.print)('The request error was a 401 code on an OAuth request, we will refresh credentials and retry.');
            try {
                await this._refreshOAuthCredentials();
            }
            catch (oauthFailure) {
                (0, helpers_2.print)(requestFailure);
                // Now we have both an OAuth failure and an original request error.
                // We throw the one that is most likely the one the user should try to fix first.
                throw oauthFailure;
            }
            // We have successfully refreshed OAuth credentials, now retry query.
            // If this retry fails, it's good that we will throw this new error
            // instead of the original error.
            return this.fetch(request, true);
        }
        let responseBody = response.body;
        if (responseBody && responseBody.length >= MaxContentLengthBytes) {
            throw new Error(`Response body is too large for Coda. Body is ${responseBody.length} bytes.`);
        }
        try {
            if (isXmlContentType(response.headers['content-type']) && !request.isBinaryResponse) {
                responseBody = await xml2js_1.default.parseStringPromise(responseBody, { explicitRoot: false });
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
        let responseHeaders = { ...response.headers };
        for (const key of Object.keys(responseHeaders)) {
            if (HeadersToStrip.includes(key.toLocaleLowerCase())) {
                // In case any services echo back sensitive headers, remove them so pack code can't see them.
                delete responseHeaders[key];
            }
        }
        // Replace sensitive template values so that pack code can't see them.
        if (((_a = this._authDef) === null || _a === void 0 ? void 0 : _a.type) === types_1.AuthenticationType.Custom) {
            const { params } = this._credentials;
            if (responseHeaders) {
                let responseHeadersStr = JSON.stringify(responseHeaders);
                Object.values(params).forEach(value => {
                    responseHeadersStr = replaceAll(responseHeadersStr, value, '<<REDACTED BY CODA>>');
                });
                responseHeaders = JSON.parse(responseHeadersStr);
            }
        }
        return {
            status: response.statusCode,
            headers: responseHeaders,
            body: responseBody,
        };
    }
    _isOAuth401(requestFailure) {
        // All these conditions will be checked again in _refreshOAuthCredentials, but those
        // checks will throw errors, so this function is used to avoid tripping those errors.
        if (!this._authDef || !this._credentials || !this._updateCredentialsCallback) {
            return false;
        }
        if (requestFailure.statusCode !== constants_2.HttpStatusCode.Unauthorized ||
            (this._authDef.type !== types_1.AuthenticationType.OAuth2 &&
                this._authDef.type !== types_1.AuthenticationType.OAuth2ClientCredentials)) {
            return false;
        }
        const type = this._authDef.type;
        switch (type) {
            case types_1.AuthenticationType.OAuth2: {
                const { accessToken, refreshToken } = this._credentials;
                if (!accessToken || !refreshToken) {
                    return false;
                }
                break;
            }
            case types_1.AuthenticationType.OAuth2ClientCredentials: {
                const { accessToken } = this._credentials;
                if (!accessToken) {
                    return false;
                }
                break;
            }
            default:
                (0, ensure_4.ensureUnreachable)(type);
        }
        return true;
    }
    async _refreshOAuthWithRefreshToken() {
        var _a;
        (0, ensure_1.assertCondition)(((_a = this._authDef) === null || _a === void 0 ? void 0 : _a.type) === types_1.AuthenticationType.OAuth2);
        (0, ensure_1.assertCondition)(this._credentials);
        // Reauth with the scopes from the original auth call, not what is currently defined in the manifest.
        const { clientId, clientSecret, accessToken, refreshToken, scopes } = this._credentials;
        (0, ensure_1.assertCondition)(accessToken);
        (0, ensure_1.assertCondition)(refreshToken);
        const { tokenUrl } = this._authDef;
        const params = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
        };
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            accept: 'application/json',
        });
        const formParams = new URLSearchParams();
        const formParamsWithSecret = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            formParams.append(key, value.toString());
            formParamsWithSecret.append(key, value.toString());
        }
        formParamsWithSecret.append('client_secret', clientSecret);
        let oauthResponse = await fetch(tokenUrl, {
            method: 'POST',
            body: formParamsWithSecret,
            headers,
        });
        if (oauthResponse.status === constants_2.HttpStatusCode.Unauthorized) {
            // see testing/oauth_server.ts why we retry with header auth.
            headers.append('Authorization', `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`);
            oauthResponse = await fetch(tokenUrl, {
                method: 'POST',
                body: formParams,
                headers,
            });
        }
        if (!oauthResponse.ok) {
            new Error(`OAuth provider returns error ${oauthResponse.status} ${oauthResponse.text}`);
        }
        const { access_token: newAccessToken, refresh_token: newRefreshToken, ...data } = await oauthResponse.json();
        return {
            clientId,
            clientSecret,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken || refreshToken,
            expires: (0, helpers_1.getExpirationDate)(Number(data.expires_in)).toString(),
            scopes,
        };
    }
    async _refreshOAuthClientCredentials() {
        var _a;
        (0, ensure_1.assertCondition)(((_a = this._authDef) === null || _a === void 0 ? void 0 : _a.type) === types_1.AuthenticationType.OAuth2ClientCredentials);
        (0, ensure_1.assertCondition)(this._credentials);
        const credentials = this._credentials;
        const { clientId, clientSecret, scopes } = credentials;
        // Refreshing client credentials is just the same as requesting the initial access token
        const { accessToken, expires } = await (0, oauth_helpers_1.performOAuthClientCredentialsServerFlow)({ clientId, clientSecret, authDef: this._authDef, scopes });
        return {
            clientId,
            clientSecret,
            accessToken,
            expires,
            scopes
        };
    }
    async _refreshOAuthCredentials() {
        (0, ensure_1.assertCondition)(this._authDef &&
            (this._authDef.type === types_1.AuthenticationType.OAuth2 ||
                this._authDef.type === types_1.AuthenticationType.OAuth2ClientCredentials));
        let credentials;
        const type = this._authDef.type;
        switch (type) {
            case types_1.AuthenticationType.OAuth2:
                credentials = await this._refreshOAuthWithRefreshToken();
                break;
            case types_1.AuthenticationType.OAuth2ClientCredentials:
                credentials = await this._refreshOAuthClientCredentials();
                break;
            default:
                (0, ensure_4.ensureUnreachable)(type);
        }
        this._credentials = credentials;
        this._updateCredentialsCallback(this._credentials);
    }
    async _applyAuthentication({ method, url: rawUrl, headers, body, form, disableAuthentication, }) {
        var _a, _b, _c, _d, _e;
        if (!this._authDef || this._authDef.type === types_1.AuthenticationType.None || disableAuthentication) {
            return { url: rawUrl, headers, body, form };
        }
        if (!this._credentials) {
            throw new Error(`${this._authDef.type} authentication is required for this pack, but no local credentials were found. ` +
                'Run "coda auth path/to/pack/manifest to set up credentials."');
        }
        const url = this._applyAndValidateEndpoint(rawUrl);
        const { host } = (0, url_parse_1.default)(url);
        switch (this._authDef.type) {
            case types_1.AuthenticationType.WebBasic: {
                const { username, password = '' } = this._credentials;
                const encodedAuth = Buffer.from(`${username}:${password}`).toString('base64');
                let bodyWithTemplateSubstitutions = body;
                if (typeof bodyWithTemplateSubstitutions === 'string') {
                    // For awful APIs that require auth parameters in the request body, we have
                    // this scheme where we do template substitution of the body using an unguessable
                    // random token as part of the template key.
                    Object.entries(this._credentials).forEach(([key, value]) => {
                        bodyWithTemplateSubstitutions = (0, ensure_2.ensureExists)(bodyWithTemplateSubstitutions).replace(getTemplateReplacementValueForKey(key, this._invocationToken), value);
                    });
                }
                return {
                    url,
                    body: bodyWithTemplateSubstitutions,
                    form,
                    headers: { ...headers, Authorization: `Basic ${encodedAuth}` },
                };
            }
            case types_1.AuthenticationType.Custom: {
                let urlWithSubstitutions = url;
                let bodyWithSubstitutions = body;
                let formWithSubstitutions = JSON.stringify(form);
                let headersWithSubstitutions = JSON.stringify(headers);
                const { params } = this._credentials;
                Object.entries(params).forEach(([key, value]) => {
                    if (urlWithSubstitutions) {
                        urlWithSubstitutions = replaceAll(urlWithSubstitutions, getTemplateReplacementValueForKey(key, this._invocationToken), encodeURIComponent(value));
                        urlWithSubstitutions = replaceAll(urlWithSubstitutions, encodeURIComponent(getTemplateReplacementValueForKey(key, this._invocationToken)), encodeURIComponent(value));
                    }
                    if (typeof bodyWithSubstitutions === 'string') {
                        bodyWithSubstitutions = replaceAll(bodyWithSubstitutions, getTemplateReplacementValueForKey(key, this._invocationToken), value);
                    }
                    if (formWithSubstitutions) {
                        formWithSubstitutions = replaceAll(formWithSubstitutions, getTemplateReplacementValueForKey(key, this._invocationToken), value);
                    }
                    if (headersWithSubstitutions) {
                        headersWithSubstitutions = replaceAll(headersWithSubstitutions, getTemplateReplacementValueForKey(key, this._invocationToken), value);
                    }
                });
                return {
                    url: urlWithSubstitutions,
                    body: bodyWithSubstitutions,
                    form: formWithSubstitutions ? JSON.parse(formWithSubstitutions) : undefined,
                    headers: headersWithSubstitutions ? JSON.parse(headersWithSubstitutions) : undefined,
                };
            }
            case types_1.AuthenticationType.QueryParamToken: {
                const { paramValue } = this._credentials;
                return { headers, body, form, url: addQueryParam(url, this._authDef.paramName, paramValue) };
            }
            case types_1.AuthenticationType.MultiQueryParamToken: {
                const { params: paramDict } = this._credentials;
                const parsedUrl = new url_1.URL(url);
                for (const [paramName, paramValue] of Object.entries(paramDict)) {
                    if (!paramValue) {
                        throw new Error(`Param value for ${paramName} is empty. Please provide a value for this parameter or omit it.`);
                    }
                    parsedUrl.searchParams.set(paramName, paramValue);
                }
                return { headers, body, form, url: parsedUrl.href };
            }
            case types_1.AuthenticationType.HeaderBearerToken:
            case types_1.AuthenticationType.CodaApiHeaderBearerToken: {
                const { token } = this._credentials;
                return { url, body, form, headers: { ...headers, Authorization: `Bearer ${token}` } };
            }
            case types_1.AuthenticationType.CustomHeaderToken: {
                const { token } = this._credentials;
                const valuePrefix = this._authDef.tokenPrefix ? `${this._authDef.tokenPrefix} ` : '';
                return { url, body, form, headers: { ...headers, [this._authDef.headerName]: `${valuePrefix}${token}` } };
            }
            case types_1.AuthenticationType.MultiHeaderToken: {
                const { headers: headerNameToToken } = this._credentials;
                const authHeaders = {};
                for (const [headerName, token] of Object.entries(headerNameToToken)) {
                    const headerDef = this._authDef.headers.find(def => def.name === headerName);
                    const valuePrefix = (headerDef === null || headerDef === void 0 ? void 0 : headerDef.tokenPrefix) ? `${headerDef.tokenPrefix} ` : '';
                    authHeaders[headerName] = `${valuePrefix}${token}`;
                }
                return { url, body, form, headers: { ...headers, ...authHeaders } };
            }
            case types_1.AuthenticationType.OAuth2:
            case types_1.AuthenticationType.OAuth2ClientCredentials: {
                const { accessToken } = this._credentials;
                const prefix = (_a = this._authDef.tokenPrefix) !== null && _a !== void 0 ? _a : 'Bearer';
                const requestHeaders = headers || {};
                let requestUrl = url;
                if (this._authDef.tokenQueryParam) {
                    requestUrl = addQueryParam(url, this._authDef.tokenQueryParam, (0, ensure_3.ensureNonEmptyString)(accessToken));
                }
                else {
                    requestHeaders.Authorization = `${prefix} ${(0, ensure_3.ensureNonEmptyString)(accessToken)}`.trim();
                }
                return {
                    url: requestUrl,
                    body,
                    form,
                    headers: requestHeaders,
                };
            }
            case types_1.AuthenticationType.AWSAccessKey: {
                const { accessKeyId, secretAccessKey } = this._credentials;
                const { service } = this._authDef;
                const credentials = {
                    accessKeyId,
                    secretAccessKey,
                };
                const resultHeaders = await this._signAwsRequest({
                    body,
                    method,
                    url,
                    service,
                    headers: {
                        ...headers,
                        host,
                    },
                    credentials,
                });
                return {
                    url,
                    body,
                    form,
                    headers: resultHeaders,
                };
            }
            case types_1.AuthenticationType.AWSAssumeRole: {
                const { roleArn, externalId } = this._credentials;
                const { service } = this._authDef;
                const { hostname } = new url_1.URL(url);
                const region = this._getAwsRegion({ service, hostname });
                const client = new client_sts_2.STSClient({ region });
                const command = new client_sts_1.AssumeRoleCommand({
                    RoleSessionName: FetcherUserAgent,
                    RoleArn: roleArn,
                    ExternalId: externalId,
                });
                const assumeRoleResult = await client.send(command);
                const credentials = {
                    accessKeyId: (0, ensure_2.ensureExists)((_b = assumeRoleResult.Credentials) === null || _b === void 0 ? void 0 : _b.AccessKeyId),
                    secretAccessKey: (0, ensure_2.ensureExists)((_c = assumeRoleResult.Credentials) === null || _c === void 0 ? void 0 : _c.SecretAccessKey),
                    sessionToken: (_d = assumeRoleResult.Credentials) === null || _d === void 0 ? void 0 : _d.SessionToken,
                    expiration: (_e = assumeRoleResult.Credentials) === null || _e === void 0 ? void 0 : _e.Expiration,
                };
                const resultHeaders = await this._signAwsRequest({
                    body,
                    method,
                    url,
                    service,
                    headers: headers || {},
                    credentials,
                });
                return {
                    url,
                    body,
                    form,
                    headers: resultHeaders,
                };
            }
            case types_1.AuthenticationType.Various:
                throw new Error('Not yet implemented');
            default:
                return (0, ensure_4.ensureUnreachable)(this._authDef);
        }
    }
    async _signAwsRequest({ body, credentials, headers, method, service, url, }) {
        const { hostname, pathname, protocol, searchParams } = new url_1.URL(url);
        const query = Object.fromEntries(searchParams.entries());
        const region = this._getAwsRegion({ service, hostname });
        const sig = new signature_v4_1.SignatureV4({
            applyChecksum: true,
            credentials,
            region,
            service,
            sha256: sha256_js_1.Sha256,
        });
        const result = await sig.sign({
            method,
            headers: headers || {},
            body,
            protocol,
            hostname,
            path: pathname,
            query,
        });
        return result.headers;
    }
    _getAwsRegion({ service, hostname }) {
        // Global services typically live in us-east-1, so sign for that region.
        if (['iam', 'cloudfront', 'globalaccelerator', 'route53', 'sts'].includes(service)) {
            return 'us-east-1';
        }
        // AWS URLs are typically of the form serviceName.region.amazonaws.com, but can have more parts in front.
        const parts = hostname.split('.');
        if (parts.length < 4) {
            return 'us-east-1';
        }
        return parts[parts.length - 3];
    }
    _applyAndValidateEndpoint(rawUrl) {
        var _a;
        if (!this._authDef ||
            this._authDef.type === types_1.AuthenticationType.None ||
            this._authDef.type === types_1.AuthenticationType.Various) {
            return rawUrl;
        }
        const endpointUrl = (_a = this._credentials) === null || _a === void 0 ? void 0 : _a.endpointUrl;
        if (!endpointUrl) {
            return rawUrl;
        }
        const parsedEndpointUrl = new url_1.URL(endpointUrl);
        const { endpointDomain } = this._authDef;
        if (endpointUrl) {
            if (parsedEndpointUrl.protocol !== 'https:') {
                throw new Error(`Only https urls are supported, but pack is configured to use ${endpointUrl}.`);
            }
            if (endpointDomain &&
                !(parsedEndpointUrl.hostname === endpointDomain || parsedEndpointUrl.hostname.endsWith(`.${endpointDomain}`))) {
                throw new Error(`The endpoint ${endpointUrl} is not authorized. The domain must match the domain ${endpointDomain} provided in the pack definition.`);
            }
        }
        const parsedUrl = (0, url_parse_1.default)(rawUrl, {});
        if (parsedUrl.hostname) {
            if (parsedUrl.hostname !== parsedEndpointUrl.hostname) {
                throw new Error(`The url ${rawUrl} is not authorized. The host must match the host ${parsedEndpointUrl.hostname} that was specified with the auth credentials. ` +
                    'Or leave the host blank and the host will be filled in automatically from the credentials.');
            }
            return rawUrl;
        }
        else {
            const prefixUrl = endpointUrl.endsWith('/') ? endpointUrl : endpointUrl + '/';
            const path = rawUrl.startsWith('/') ? rawUrl.slice(1) : rawUrl;
            return prefixUrl + path;
        }
    }
    _validateHost(url, method) {
        const parsed = new url_1.URL(url);
        const host = parsed.host.toLowerCase();
        const allowedDomains = this._networkDomains || [];
        if (!allowedDomains
            .map(domain => domain.toLowerCase())
            .some(domain => host === domain || host.endsWith(`.${domain}`)) &&
            !(method === 'GET' ? constants_1.DEFAULT_ALLOWED_GET_DOMAINS_REGEXES : []).some(domain => domain.test(host.toLowerCase()))) {
            throw new Error(`Attempted to connect to undeclared host '${host}'`);
        }
    }
}
exports.AuthenticatingFetcher = AuthenticatingFetcher;
// Namespaced object that can be mocked for testing.
exports.requestHelper = {
    makeRequest: async (request) => {
        return (0, node_fetcher_1.nodeFetcher)({
            ...request,
            resolveWithFullResponse: true,
            timeout: 60000,
            forever: true, // keep alive connections as long as possible.
        });
    },
};
class AuthenticatingBlobStorage {
    constructor(fetcher) {
        this._fetcher = fetcher;
    }
    async storeUrl(url, _opts) {
        await this._fetcher.fetch({ method: 'GET', url, isBinaryResponse: true });
        return `https://not-a-real-url.s3.amazonaws.com/tempBlob/${(0, uuid_1.v4)()}`;
    }
    async storeBlob(_blobData, _contentType, _opts) {
        return `https://not-a-real-url.s3.amazonaws.com/tempBlob/${(0, uuid_1.v4)()}`;
    }
}
function newFetcherExecutionContext(updateCredentialsCallback, authDef, networkDomains, credentials) {
    const invocationToken = (0, uuid_1.v4)();
    const fetcher = new AuthenticatingFetcher(updateCredentialsCallback, authDef, networkDomains, credentials, invocationToken);
    return {
        invocationLocation: {
            protocolAndHost: 'https://coda.io',
        },
        timezone: 'America/Los_Angeles',
        invocationToken,
        endpoint: credentials === null || credentials === void 0 ? void 0 : credentials.endpointUrl,
        fetcher,
        temporaryBlobStorage: new AuthenticatingBlobStorage(fetcher),
    };
}
exports.newFetcherExecutionContext = newFetcherExecutionContext;
function newFetcherSyncExecutionContext(updateCredentialsCallback, authDef, networkDomains, credentials) {
    const context = newFetcherExecutionContext(updateCredentialsCallback, authDef, networkDomains, credentials);
    return { ...context, sync: {} };
}
exports.newFetcherSyncExecutionContext = newFetcherSyncExecutionContext;
function addQueryParam(url, param, value) {
    const parsedUrl = new url_1.URL(url);
    // Put the key at the beginning, as some APIs expect it at the beginning.
    const entries = [...parsedUrl.searchParams.entries()];
    parsedUrl.searchParams.set(param, value);
    for (const [key, entryValue] of entries) {
        parsedUrl.searchParams.delete(key);
        parsedUrl.searchParams.set(key, entryValue);
    }
    return parsedUrl.href;
}
const ApplicationXmlRegexp = /application\/(\S+\+)?xml/;
function isXmlContentType(contentTypeHeader) {
    if (!contentTypeHeader) {
        return false;
    }
    const header = contentTypeHeader.toLocaleLowerCase();
    return header.includes('text/xml') || ApplicationXmlRegexp.test(header);
}
