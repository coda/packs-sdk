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
exports.makeRedirectUrl = exports.launchOAuthServerFlow = void 0;
const client_oauth2_1 = __importDefault(require("client-oauth2"));
const child_process_1 = require("child_process");
const express_1 = __importDefault(require("express"));
const helpers_1 = require("./helpers");
function launchOAuthServerFlow({ clientId, clientSecret, authDef, port, afterTokenExchange, }) {
    // TODO: Handle endpointKey.
    const { authorizationUrl, tokenUrl, scopes, additionalParams } = authDef;
    const oauth2Client = new client_oauth2_1.default({
        clientId,
        clientSecret,
        authorizationUri: authorizationUrl,
        accessTokenUri: tokenUrl,
        scopes,
        redirectUri: makeRedirectUrl(port),
        query: additionalParams,
    });
    const serverContainer = new OAuthServerContainer(oauth2Client, afterTokenExchange, port);
    const launchCallback = () => {
        const authUrl = oauth2Client.code.getUri();
        helpers_1.print(`OAuth server running at http://localhost:${port}.\n` +
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
        app.get('/oauth', (req, res) => __awaiter(this, void 0, void 0, function* () {
            // TODO: Figure out how to get refresh tokens, maybe including grant_type: 'authorization_code'.
            const tokenData = yield this._oauth2Client.code.getToken(req.originalUrl);
            const { accessToken, refreshToken } = tokenData;
            this._afterTokenExchange({ accessToken, refreshToken });
            setTimeout(() => this.shutDown(), 10);
            return res.send('OAuth authentication is complete! You can close this browser tab.');
        }));
        this._server = app.listen(this._port, launchCallback);
    }
    shutDown() {
        var _a;
        (_a = this._server) === null || _a === void 0 ? void 0 : _a.close();
    }
}
