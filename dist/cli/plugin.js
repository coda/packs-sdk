"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePluginComponents = exports.handlePluginPlan = exports.handlePluginValidate = exports.handleAddPlugin = void 0;
const listing_1 = require("../plugin/listing");
const listing_2 = require("../plugin/listing");
const listing_3 = require("../plugin/listing");
const plugin_output_1 = require("./plugin_output");
const plugin_output_2 = require("./plugin_output");
const validate_1 = require("./validate");
const listing_4 = require("../plugin/listing");
const path_1 = __importDefault(require("path"));
const listing_5 = require("../plugin/listing");
const helpers_1 = require("../testing/helpers");
const listing_6 = require("../plugin/listing");
const validate_2 = require("./validate");
const listing_7 = require("../plugin/listing");
const listing_8 = require("../plugin/listing");
const listing_9 = require("../plugin/listing");
async function handleAddPlugin({ name, output }) {
    const pluginName = name || 'my-plugin';
    const targetDir = path_1.default.resolve(process.cwd(), pluginName);
    const pluginJsonPath = path_1.default.join(targetDir, listing_2.PluginListingFileName);
    if ((0, plugin_output_2.isExistingPlugin)(pluginJsonPath, pluginName)) {
        return (0, helpers_1.printAndExit)((0, plugin_output_1.formatScaffoldResult)(pluginName, targetDir, 'unchanged', output), 0);
    }
    try {
        (0, listing_6.scaffoldPlugin)(targetDir, pluginName);
    }
    catch (err) {
        return (0, helpers_1.printAndExit)(err instanceof listing_1.PluginListingError ? err.message : String(err));
    }
    return (0, helpers_1.printAndExit)((0, plugin_output_1.formatScaffoldResult)(pluginName, targetDir, 'created', output), 0);
}
exports.handleAddPlugin = handleAddPlugin;
async function handlePluginValidate({ pluginJson, output }) {
    const pluginJsonPath = path_1.default.resolve(process.cwd(), pluginJson || listing_2.PluginListingFileName);
    try {
        const listing = (0, listing_4.loadPluginListing)(pluginJsonPath);
        const pluginRoot = path_1.default.dirname(pluginJsonPath);
        (0, listing_9.validatePluginListing)(listing, pluginRoot);
        await validatePluginComponents(listing, pluginRoot);
        const result = output === 'json'
            ? JSON.stringify({ valid: true, name: listing.name, pluginJson: pluginJsonPath }, null, 2)
            : `Plugin definition is valid: ${pluginJsonPath}`;
        return (0, helpers_1.printAndExit)(result, 0);
    }
    catch (err) {
        return (0, helpers_1.printAndExit)(err instanceof listing_1.PluginListingError ? err.message : String(err));
    }
}
exports.handlePluginValidate = handlePluginValidate;
async function handlePluginPlan({ pluginJson, output }) {
    const pluginJsonPath = path_1.default.resolve(process.cwd(), pluginJson || listing_2.PluginListingFileName);
    try {
        const listing = (0, listing_4.loadPluginListing)(pluginJsonPath);
        const pluginRoot = path_1.default.dirname(pluginJsonPath);
        (0, listing_9.validatePluginListing)(listing, pluginRoot);
        const componentMetadata = await validatePluginComponents(listing, pluginRoot);
        const plan = (0, listing_5.planPluginPublish)(pluginJsonPath, componentMetadata);
        return (0, helpers_1.printAndExit)(output === 'json' ? JSON.stringify(plan, null, 2) : (0, listing_3.formatPluginPublishPlan)(plan), 0);
    }
    catch (err) {
        return (0, helpers_1.printAndExit)(err instanceof listing_1.PluginListingError ? err.message : String(err));
    }
}
exports.handlePluginPlan = handlePluginPlan;
async function validatePluginComponents(listing, pluginRoot) {
    const componentMetadata = {};
    for (const [componentName, component] of Object.entries(listing.components)) {
        if (component.type !== 'agent' && component.type !== 'connector') {
            continue;
        }
        const manifestPath = path_1.default.resolve(pluginRoot, component.manifest);
        try {
            const metadata = await (0, validate_1.loadPackMetadataForValidation)(manifestPath);
            await (0, validate_2.validateMetadataOrThrow)(metadata);
            (0, listing_8.validatePluginComponentType)(componentName, component, metadata);
            componentMetadata[componentName] = metadata;
        }
        catch (err) {
            if (err instanceof listing_1.PluginListingError) {
                throw err;
            }
            const detail = err instanceof Error ? err.message : String(err);
            throw new listing_1.PluginListingError(`Invalid ${component.type} component ${componentName}: ${detail}`);
        }
    }
    (0, listing_7.validatePluginComponentMetadata)(listing, componentMetadata);
    return componentMetadata;
}
exports.validatePluginComponents = validatePluginComponents;
