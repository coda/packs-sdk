"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const types_2 = require("../types");
const schema_1 = require("../schema");
const sample_utils_1 = require("../helpers/sample_utils");
const sample_utils_2 = require("../helpers/sample_utils");
const api_1 = require("../api");
const api_2 = require("../api");
const api_3 = require("../api");
const schema_2 = require("../schema");
const api_4 = require("../api");
const api_5 = require("../api");
const api_6 = require("../api");
const api_7 = require("../api");
const url_1 = require("../helpers/url");
exports.FakeNpmProviderId = 9011;
exports.FakeNpmPackId = 8003;
exports.FakeNpmPackVersion = '5.2.3';
const packageSchema = schema_2.makeSchema({
    type: schema_1.ValueType.Object,
    identity: {
        packId: exports.FakeNpmPackId,
        name: 'Package',
    },
    properties: {
        package: { type: schema_1.ValueType.String, primary: true },
        url: { type: schema_1.ValueType.String, id: true },
        downloadCount: { type: schema_1.ValueType.Number },
    },
});
const FakeNpmDefinitionFake = {
    id: exports.FakeNpmPackId,
    name: 'NPM',
    shortDescription: 'npm',
    description: 'Node module repository',
    version: exports.FakeNpmPackVersion,
    providerId: exports.FakeNpmProviderId,
    category: types_2.PackCategory.Communication,
    logoPath: 'some/path',
    defaultAuthentication: {
        type: types_1.AuthenticationType.HeaderBearerToken,
    },
    formats: [
        {
            name: 'Package',
            formulaNamespace: 'NPM',
            formulaName: 'Package',
            hasNoConnection: true,
            instructions: 'Paste the URL of a NPM package into the column. For example, "https://www.npmjs.com/package/[name]"',
            matchers: [/https:\/\/npmjs\.com\/package\/(\w+)/],
            placeholder: 'Link to NPM package',
        },
    ],
    formulas: {
        NPM: [
            api_3.makeObjectFormula({
                response: {
                    schema: packageSchema,
                },
                name: 'Package',
                description: 'Get live data about a NPM package.',
                examples: [],
                parameters: [
                    api_6.makeStringParameter('name', 'Package name'),
                    api_1.makeBooleanParameter('monthly', 'Show monthly download count instead of weekly', { optional: true }),
                ],
                network: { hasSideEffect: false, hasConnection: false },
                execute: ([name, monthly], context) => __awaiter(this, void 0, void 0, function* () {
                    const url = url_1.withQueryParams(`https://npmjs.com/api/packages/${name}`, { monthly: String(monthly) });
                    const result = yield context.fetcher.fetch({ method: 'GET', url });
                    return result.body;
                }),
            }),
            api_5.makeStringFormula({
                name: 'FakeGetPackageUrls',
                description: 'Retrieve a list of packages URLs, comma separated',
                examples: [],
                parameters: [api_4.makeStringArrayParameter('names', 'Names of packages to download')],
                network: { hasSideEffect: false, hasConnection: false },
                execute: ([names]) => __awaiter(this, void 0, void 0, function* () {
                    return names.map(name => `https://npmjs.com/api/packages/${name}`).join(',');
                }),
            }),
            api_2.makeNumericFormula({
                name: 'FakeDownloadPackage',
                description: 'Initiate a download of the package, increasing its popularity (this action formula is for tests)',
                examples: [],
                parameters: [api_6.makeStringParameter('url', 'Url to a package')],
                network: { hasSideEffect: true, hasConnection: false, requiresConnection: false },
                execute: ([name], context) => __awaiter(this, void 0, void 0, function* () {
                    const url = url_1.withQueryParams(`https://npmjs.com/api/packages/${name}/download`);
                    const result = yield context.fetcher.fetch({ method: 'POST', url });
                    return result.body;
                }),
            }),
            api_2.makeNumericFormula({
                name: 'FakeAddPackage',
                description: 'Adds a fake package',
                examples: [],
                parameters: [api_6.makeStringParameter('name', 'Package name')],
                network: { hasSideEffect: true, hasConnection: true, requiresConnection: true },
                execute: ([name], context) => __awaiter(this, void 0, void 0, function* () {
                    const url = url_1.withQueryParams(`https://npmjs.com/api/packages`);
                    const result = yield context.fetcher.fetch({ method: 'POST', body: JSON.stringify({ name }), url });
                    return result.body;
                }),
            }),
        ],
    },
    syncTables: [
        api_7.makeSyncTable('Packages', packageSchema, {
            name: 'SyncPackages',
            description: 'Pull down NPM packages.',
            examples: [],
            parameters: [],
            network: { hasSideEffect: false, hasConnection: false },
            execute: ([], context, continuation) => __awaiter(this, void 0, void 0, function* () {
                const url = url_1.withQueryParams(`https://npmjs.com/api/packages/`, { continuation });
                const result = yield context.fetcher.fetch({ method: 'GET', url });
                return result.body;
            }),
            schema: {
                type: schema_1.ValueType.Array,
                items: packageSchema,
            },
        }),
    ],
};
exports.FakeNpmDefinition = sample_utils_1.fakeDefinitionToDefinition(FakeNpmDefinitionFake);
exports.FakeNpmMetadata = sample_utils_2.fakeDefinitionToMetadata(FakeNpmDefinitionFake);
