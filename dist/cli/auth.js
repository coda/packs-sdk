"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAuth = void 0;
const build_1 = require("./build");
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const auth_1 = require("../testing/auth");
async function handleAuth({ manifestPath, oauthServerPort, extraOAuthScopes }) {
    const fullManifestPath = (0, helpers_2.makeManifestFullPath)(manifestPath);
    const bundleFilename = await (0, build_1.build)(fullManifestPath);
    const manifest = await (0, helpers_1.importManifest)(bundleFilename);
    await (0, auth_1.setupAuthFromModule)(fullManifestPath, manifest, { oauthServerPort, extraOAuthScopes });
}
exports.handleAuth = handleAuth;
