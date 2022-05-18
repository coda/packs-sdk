"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRedirectUrl = exports.launchOAuthServerFlow = void 0;
require("cross-fetch/polyfill");
const constants_1 = require("./constants");
const child_process_1 = require("child_process");
const express_1 = __importDefault(require("express"));
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const url_1 = require("../helpers/url");
function launchOAuthServerFlow({ clientId, clientSecret, authDef, port, afterTokenExchange, scopes, }) {
    // TODO: Handle endpointKey.
    const { authorizationUrl, tokenUrl, additionalParams, scopeDelimiter, nestedResponseKey, scopeParamName } = authDef;
    // Use the manifest's scopes as a default.
    const requestedScopes = scopes && scopes.length > 0 ? scopes : authDef.scopes;
    const scope = requestedScopes ? requestedScopes.join(scopeDelimiter || ' ') : requestedScopes;
    const redirectUri = makeRedirectUrl(port);
    const callback = async (code) => {
        const params = {
            grant_type: 'authorization_code',
            code,
            client_id: clientId,
            redirect_uri: redirectUri,
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
        if (oauthResponse.status === constants_1.HttpStatusCode.Unauthorized) {
            // https://datatracker.ietf.org/doc/html/rfc6749#section-3.2.1 doesn't specify how exactly client secret is
            // passed to the oauth provider. https://datatracker.ietf.org/doc/html/rfc6749#section-2.3 says that client should
            // NOT has more than one auth methods.
            //
            // To workaround with OAuth provider that uses different auth method, we fallback to header auth if body param
            // auth fails with 401. This is the same behavior in production.
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
        const responseBody = await oauthResponse.json();
        const tokenContainer = nestedResponseKey ? responseBody[nestedResponseKey] : responseBody;
        const { access_token: accessToken, refresh_token: refreshToken, ...data } = tokenContainer;
        return { accessToken, refreshToken, data };
    };
    const serverContainer = new OAuthServerContainer(callback, afterTokenExchange, port);
    const queryParams = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        ...(additionalParams || {}),
    };
    const scopeKey = scopeParamName || 'scope';
    queryParams[scopeKey] = scope;
    const authorizationUri = (0, url_1.withQueryParams)(authorizationUrl, queryParams);
    const launchCallback = () => {
        (0, helpers_2.print)(`OAuth server running at http://localhost:${port}.\n` +
            `Complete the auth flow in your browser. If it does not open automatically, visit ${authorizationUri}`);
        (0, child_process_1.exec)(`open "${authorizationUri}"`);
    };
    serverContainer.start(launchCallback);
}
exports.launchOAuthServerFlow = launchOAuthServerFlow;
function makeRedirectUrl(port) {
    return `http://localhost:${port}/oauth`;
}
exports.makeRedirectUrl = makeRedirectUrl;
class OAuthServerContainer {
    constructor(tokenCallback, afterTokenExchange, port) {
        this._tokenCallback = tokenCallback;
        this._port = port;
        this._afterTokenExchange = afterTokenExchange;
    }
    start(launchCallback) {
        const app = (0, express_1.default)();
        app.get('/oauth', async (req, res) => {
            const code = new URL(req.originalUrl, 'http://localhost').searchParams.get('code');
            setTimeout(() => this.shutDown(), 1000);
            if (code) {
                const tokenData = await this._tokenCallback(code);
                const { accessToken, refreshToken, data } = tokenData;
                const expires = data.expires_in && (0, helpers_1.getExpirationDate)(Number(data.expires_in)).toString();
                this._afterTokenExchange({ accessToken, refreshToken, expires });
                return res.send('OAuth authentication is complete! You can close this browser tab.');
            }
            return res.send(`Invalid authorization code received: ${code}`);
        });
        this._server = app.listen(this._port, launchCallback);
    }
    shutDown() {
        var _a;
        (_a = this._server) === null || _a === void 0 ? void 0 : _a.close();
    }
}
