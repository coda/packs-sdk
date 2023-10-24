"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRedirectUrl = exports.launchOAuthServerFlow = void 0;
require("cross-fetch/polyfill");
const child_process_1 = require("child_process");
const express_1 = __importDefault(require("express"));
const oauth_helpers_1 = require("./oauth_helpers");
const helpers_1 = require("./helpers");
const oauth_helpers_2 = require("./oauth_helpers");
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
            client_secret: clientSecret,
            redirect_uri: redirectUri,
        };
        return (0, oauth_helpers_2.requestOAuthAccessToken)(params, {
            tokenUrl,
            nestedResponseKey,
        });
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
        (0, helpers_1.print)(`OAuth server running at http://localhost:${port}.\n` +
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
                const expires = (0, oauth_helpers_1.getTokenExpiry)(data);
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
