"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePluginPlan = exports.handlePluginValidate = exports.handleAddPlugin = void 0;
const listing_1 = require("../plugin/listing");
const listing_2 = require("../plugin/listing");
const listing_3 = require("../plugin/listing");
const listing_4 = require("../plugin/listing");
const path_1 = __importDefault(require("path"));
const listing_5 = require("../plugin/listing");
const helpers_1 = require("../testing/helpers");
const listing_6 = require("../plugin/listing");
const listing_7 = require("../plugin/listing");
async function handleAddPlugin({ name }) {
    const pluginName = name || 'my-plugin';
    const targetDir = path_1.default.resolve(process.cwd(), pluginName);
    try {
        (0, listing_6.scaffoldPlugin)(targetDir, pluginName);
    }
    catch (err) {
        return (0, helpers_1.printAndExit)(err instanceof listing_1.PluginListingError ? err.message : String(err));
    }
    return (0, helpers_1.printAndExit)([
        `SPIKE: scaffolded plugin listing at ${targetDir}`,
        `  ${listing_2.PluginListingFileName}  (directory listing: agent + connector packs)`,
        '  SETUP.md',
        '  agent/pack.ts',
        '  connector/pack.ts',
        '',
        'Next: coda plugin validate ' + path_1.default.join(pluginName, listing_2.PluginListingFileName),
        'Then: coda plugin plan ' + path_1.default.join(pluginName, listing_2.PluginListingFileName),
    ].join('\n'), 0);
}
exports.handleAddPlugin = handleAddPlugin;
async function handlePluginValidate({ pluginJson }) {
    const pluginJsonPath = path_1.default.resolve(process.cwd(), pluginJson || listing_2.PluginListingFileName);
    try {
        const listing = (0, listing_4.loadPluginListing)(pluginJsonPath);
        (0, listing_7.validatePluginListing)(listing, path_1.default.dirname(pluginJsonPath));
        return (0, helpers_1.printAndExit)(`Plugin definition is valid: ${pluginJsonPath}`, 0);
    }
    catch (err) {
        return (0, helpers_1.printAndExit)(err instanceof listing_1.PluginListingError ? err.message : String(err));
    }
}
exports.handlePluginValidate = handlePluginValidate;
async function handlePluginPlan({ pluginJson }) {
    const pluginJsonPath = path_1.default.resolve(process.cwd(), pluginJson || listing_2.PluginListingFileName);
    try {
        const plan = (0, listing_5.planPluginPublish)(pluginJsonPath);
        return (0, helpers_1.printAndExit)((0, listing_3.formatPluginPublishPlan)(plan), 0);
    }
    catch (err) {
        return (0, helpers_1.printAndExit)(err instanceof listing_1.PluginListingError ? err.message : String(err));
    }
}
exports.handlePluginPlan = handlePluginPlan;
