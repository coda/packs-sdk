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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePublish = void 0;
const logging_1 = require("../helpers/logging");
const build_1 = require("./build");
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const helpers_3 = require("./helpers");
const helpers_4 = require("./helpers");
const helpers_5 = require("../testing/helpers");
const helpers_6 = require("../testing/helpers");
const create_1 = require("./create");
const request_promise_native_1 = __importDefault(require("request-promise-native"));
function handlePublish({ manifestFile, codaApiEndpoint }) {
    return __awaiter(this, void 0, void 0, function* () {
        const formattedEndpoint = helpers_2.formatEndpoint(codaApiEndpoint);
        const logger = new logging_1.ConsoleLogger();
        const { manifest } = yield Promise.resolve().then(() => __importStar(require(manifestFile)));
        logger.info('Building pack bundle...');
        const bundleFilename = yield build_1.build(manifestFile);
        // Since package.json isn't in dist, we grab it from the root directory instead.
        const packageJson = yield Promise.resolve().then(() => __importStar(require(helpers_4.isTestCommand() ? '../package.json' : '../../package.json')));
        const codaPacksSDKVersion = packageJson.version;
        codaPacksSDKVersion;
        const apiKey = helpers_3.getApiKey();
        if (!apiKey) {
            helpers_5.printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
        }
        const client = helpers_1.createCodaClient(apiKey, formattedEndpoint);
        const packs = create_1.readPacksFile();
        const packId = packs && packs[manifest.name];
        if (!packId) {
            helpers_5.printAndExit(`Could not find a pack id registered to pack "${manifest.name}"`);
        }
        const packVersion = manifest.version;
        if (!packVersion) {
            helpers_5.printAndExit(`No pack version found for your pack "${manifest.name}"`);
        }
        //  TODO(alan): error testing
        try {
            logger.info('Registering new pack version...');
            const { uploadUrl } = yield client.registerPackVersion(packId, packVersion);
            logger.info('Uploading pack...');
            const metadata = compilePackMetadata(manifest);
            yield uploadPackToSignedUrl(bundleFilename, metadata, uploadUrl);
            logger.info('Validating upload...');
            yield client.packVersionUploadComplete(packId, packVersion);
        }
        catch (err) {
            helpers_5.printAndExit(`Error: ${err}`);
        }
        logger.info('Done!');
    });
}
exports.handlePublish = handlePublish;
function uploadPackToSignedUrl(bundleFilename, metadata, uploadUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const bundle = helpers_6.readFile(bundleFilename);
        if (!bundle) {
            helpers_5.printAndExit(`Could not find bundle file at path ${bundleFilename}`);
        }
        try {
            yield request_promise_native_1.default.put(uploadUrl, {
                headers: {
                    'Content-Type': 'application/json',
                },
                json: {
                    metadata,
                    bundle: bundle.toString(),
                },
            });
        }
        catch (err) {
            helpers_5.printAndExit(`Error in uploading pack to signed url: ${err}`);
        }
    });
}
function compilePackMetadata(manifest) {
    const { formats, formulas, formulaNamespace, syncTables } = manifest, definition = __rest(manifest, ["formats", "formulas", "formulaNamespace", "syncTables"]);
    const compiledFormats = compileFormatsMetadata(formats || []);
    const compiledFormulas = (formulas && compileFormulasMetadata(formulas)) || (Array.isArray(formulas) ? [] : {});
    const metadata = Object.assign(Object.assign({}, definition), { formulaNamespace, formats: compiledFormats, formulas: compiledFormulas, syncTables: (syncTables || []).map(compileSyncTable) });
    return metadata;
}
function compileFormatsMetadata(formats) {
    return formats.map(format => {
        return Object.assign(Object.assign({}, format), { matchers: (format.matchers || []).map(matcher => matcher.toString()) });
    });
}
function compileFormulasMetadata(formulas) {
    const formulasMetadata = Array.isArray(formulas) ? [] : {};
    // TODO: @alan-fang delete once we move packs off of PackFormulas
    if (Array.isArray(formulas)) {
        formulasMetadata.push(...formulas.map(compileFormulaMetadata));
    }
    else {
        for (const namespace of Object.keys(formulas)) {
            formulasMetadata[namespace] = formulas[namespace].map(compileFormulaMetadata);
        }
    }
    return formulasMetadata;
}
function compileFormulaMetadata(formula) {
    const { execute } = formula, rest = __rest(formula, ["execute"]);
    return rest;
}
function compileSyncTable(syncTable) {
    const { getter } = syncTable, rest = __rest(syncTable, ["getter"]);
    const { execute } = getter, getterRest = __rest(getter, ["execute"]);
    return Object.assign(Object.assign({}, rest), { getter: getterRest });
}
