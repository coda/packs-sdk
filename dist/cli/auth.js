"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.handleAuth = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const auth_1 = require("../testing/auth");
const helpers_3 = require("./helpers");
const AUTH_BOOTSTRAP_CODE = `
import {setupAuthFromModule} from 'coda-packs-sdk/dist/testing/auth';

async function main() {
  const manifestPath = process.argv[1];
  const oauthServerPort = process.argv[2] ? parseInt(process.argv[2]) : undefined;
  const module = await import(manifestPath);
  await setupAuthFromModule(manifestPath, module, {oauthServerPort});
}

void main();`;
async function handleAuth({ manifestPath, oauthServerPort }) {
    const fullManifestPath = helpers_2.makeManifestFullPath(manifestPath);
    if (helpers_1.isTypescript(manifestPath)) {
        const tsCommand = `ts-node -e "${AUTH_BOOTSTRAP_CODE}" ${fullManifestPath} ${oauthServerPort || '""'}`;
        helpers_3.spawnBootstrapCommand(tsCommand);
    }
    else {
        const module = await Promise.resolve().then(() => __importStar(require(fullManifestPath)));
        await auth_1.setupAuthFromModule(fullManifestPath, module, { oauthServerPort });
    }
}
exports.handleAuth = handleAuth;
