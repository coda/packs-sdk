"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRedirectUrl = exports.launchOAuthServerFlow = void 0;
const client_oauth2_1 = __importDefault(require("client-oauth2"));
const child_process_1 = require("child_process");
const express_1 = __importDefault(require("express"));
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
function launchOAuthServerFlow({ clientId, clientSecret, authDef, port, afterTokenExchange, scopes, }) {
    // TODO: Handle endpointKey.
    const { authorizationUrl, tokenUrl, additionalParams } = authDef;
    // Use the manifest's scopes as a default.
    const requestedScopes = scopes && scopes.length > 0 ? scopes : authDef.scopes;
    const oauth2Client = new client_oauth2_1.default({
        clientId,
        clientSecret,
        authorizationUri: authorizationUrl,
        accessTokenUri: tokenUrl,
        scopes: requestedScopes,
        redirectUri: makeRedirectUrl(port),
        query: additionalParams,
    });
    const serverContainer = new OAuthServerContainer(oauth2Client, afterTokenExchange, port);
    const launchCallback = () => {
        const authUrl = oauth2Client.code.getUri();
        helpers_2.print(`OAuth server running at http://localhost:${port}.\n` +
            `Complete the auth flow in your browser. If it does not open automatically, visit ${authUrl}`);
        child_process_1.exec(`open "${authUrl}"`);
    };
    serverContainer.start(launchCallback);
}
exports.launchOAuthServerFlow = launchOAuthServerFlow;
function makeRedirectUrl(port) {
    return `http://localhost:${port}/oauth`;
}
exports.makeRedirectUrl = makeRedirectUrl;
class OAuthServerContainer {
    constructor(oauth2Client, afterTokenExchange, port) {
        this._port = port;
        this._oauth2Client = oauth2Client;
        this._afterTokenExchange = afterTokenExchange;
    }
    start(launchCallback) {
        const app = express_1.default();
        app.get('/oauth', async (req, res) => {
            const tokenData = await this._oauth2Client.code.getToken(req.originalUrl);
            const { accessToken, refreshToken, data } = tokenData;
            const expires = data.expires_in && helpers_1.getExpirationDate(Number(data.expires_in)).toString();
            this._afterTokenExchange({ accessToken, refreshToken, expires });
            setTimeout(() => this.shutDown(), 10);
            return res.send('OAuth authentication is complete! You can close this browser tab.');
        });
        this._server = app.listen(this._port, launchCallback);
    }
    shutDown() {
        var _a;
        (_a = this._server) === null || _a === void 0 ? void 0 : _a.close();
    }
}
