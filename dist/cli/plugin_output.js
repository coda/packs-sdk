"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatScaffoldResult = exports.isExistingPlugin = void 0;
const listing_1 = require("../plugin/listing");
const listing_2 = require("../plugin/listing");
const path_1 = __importDefault(require("path"));
const listing_3 = require("../plugin/listing");
function isExistingPlugin(pluginJsonPath, expectedName) {
    try {
        const listing = (0, listing_2.loadPluginListing)(pluginJsonPath);
        (0, listing_3.validatePluginListing)(listing, path_1.default.dirname(pluginJsonPath));
        return listing.name === expectedName;
    }
    catch {
        return false;
    }
}
exports.isExistingPlugin = isExistingPlugin;
function formatScaffoldResult(pluginName, targetDir, status, output) {
    const pluginJson = path_1.default.join(targetDir, listing_1.PluginListingFileName);
    const files = [
        pluginJson,
        path_1.default.join(targetDir, 'SETUP.md'),
        path_1.default.join(targetDir, 'agent', 'pack.ts'),
        path_1.default.join(targetDir, 'connector', 'pack.ts'),
    ];
    if (output === 'json') {
        return JSON.stringify({
            status,
            name: pluginName,
            directory: targetDir,
            pluginJson,
            files,
            next: {
                validate: `coda plugin validate ${pluginJson}`,
                plan: `coda plugin plan ${pluginJson}`,
            },
        }, null, 2);
    }
    if (status === 'unchanged') {
        return `Plugin already scaffolded at ${targetDir}. No change needed.`;
    }
    return [
        `Scaffolded plugin listing at ${targetDir}`,
        `  ${listing_1.PluginListingFileName}  (directory listing: agent + connector packs)`,
        '  SETUP.md',
        '  agent/pack.ts',
        '  connector/pack.ts',
        '',
        `Next: coda plugin validate ${pluginJson}`,
        `Then: coda plugin plan ${pluginJson}`,
    ].join('\n');
}
exports.formatScaffoldResult = formatScaffoldResult;
