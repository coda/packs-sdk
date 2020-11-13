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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeNpmMetadata = exports.FakeNpmDefinition = exports.packageSchema = exports.personSchema = exports.versionSchema = exports.FakeNpmPackVersion = exports.FakeNpmPackId = exports.FakeNpmProviderId = void 0;
const types_1 = require("../types");
const types_2 = require("../types");
const types_3 = require("../types");
const types_4 = require("../types");
const types_5 = require("../types");
const schema_1 = require("../schema");
const ensure_1 = require("../helpers/ensure");
const sample_utils_1 = require("../helpers/sample_utils");
const sample_utils_2 = require("../helpers/sample_utils");
const url_1 = require("../helpers/url");
const api_1 = require("../api");
const api_2 = require("../api");
const api_3 = require("../api");
const api_4 = require("../api");
const api_5 = require("../api");
const api_6 = require("../api");
const schema_2 = require("../schema");
const schema_3 = require("../schema");
const schema_4 = require("../schema");
const api_7 = require("../api");
const api_8 = require("../api");
const api_9 = require("../api");
const api_10 = require("../api");
const url_2 = require("../helpers/url");
exports.FakeNpmProviderId = 9011;
exports.FakeNpmPackId = 8003;
exports.FakeNpmPackVersion = '5.2.3';
exports.versionSchema = schema_2.makeObjectSchema({
    type: schema_1.ValueType.Object,
    identity: {
        packId: exports.FakeNpmPackId,
        name: 'PackageVersion',
    },
    id: 'url',
    primary: 'url',
    properties: {
        url: { type: schema_1.ValueType.String },
        version: { type: schema_1.ValueType.String },
        downloadCount: { type: schema_1.ValueType.Number },
    },
});
exports.personSchema = schema_2.makeObjectSchema({
    type: schema_1.ValueType.Object,
    codaType: schema_1.ValueType.Person,
    id: 'email',
    primary: 'name',
    properties: {
        email: { type: schema_1.ValueType.String },
        name: { type: schema_1.ValueType.String },
    },
});
exports.packageSchema = schema_2.makeObjectSchema({
    type: schema_1.ValueType.Object,
    identity: {
        packId: exports.FakeNpmPackId,
        name: 'Package',
    },
    id: 'url',
    primary: 'url',
    featured: ['packageName', 'downloadCount'],
    properties: {
        packageName: { type: schema_1.ValueType.String },
        url: { type: schema_1.ValueType.String },
        author: exports.personSchema,
        downloadCount: { type: schema_1.ValueType.Number },
        versions: {
            type: schema_1.ValueType.Array,
            items: schema_3.makeReferenceSchemaFromObjectSchema(exports.versionSchema),
        },
    },
});
const FakeNpmDefinitionFake = {
    id: exports.FakeNpmPackId,
    name: 'NPM',
    shortDescription: 'npm',
    description: 'Node module repository',
    version: exports.FakeNpmPackVersion,
    providerId: exports.FakeNpmProviderId,
    category: types_3.PackCategory.Communication,
    logoPath: 'some/path',
    defaultAuthentication: {
        type: types_1.AuthenticationType.HeaderBearerToken,
        getConnectionName: api_4.makeMetadataFormula((_ctx, search) => __awaiter(void 0, void 0, void 0, function* () { return `FakeConnection ${search}`; })),
        postSetup: [
            {
                name: 'getDefaultOptions1',
                description: 'Get default options',
                getOptionsFormula: api_4.makeMetadataFormula(() => __awaiter(void 0, void 0, void 0, function* () { return `FakeConnection getDefaultOptions1`; })),
            },
            {
                name: 'getDefaultOptions2',
                description: 'Get default options - second',
                getOptionsFormula: api_4.makeMetadataFormula(() => __awaiter(void 0, void 0, void 0, function* () { return `FakeConnection getDefaultOptions2`; })),
            },
        ],
    },
    minimumFeatureSet: types_2.FeatureSet.Pro,
    quotas: {
        [types_2.FeatureSet.Basic]: {
            monthlyLimits: {
                [types_4.QuotaLimitType.Action]: 10,
                [types_4.QuotaLimitType.Getter]: 100,
            },
            sync: {
                maximumInterval: types_5.SyncInterval.Manual,
                maximumRowCount: 100,
            },
        },
        [types_2.FeatureSet.Pro]: {
            sync: {
                maximumInterval: types_5.SyncInterval.Manual,
                maximumRowCount: 1000,
            },
        },
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
            api_6.makeObjectFormula({
                response: {
                    schema: exports.packageSchema,
                },
                name: 'Package',
                description: 'Get live data about a NPM package.',
                examples: [],
                parameters: [
                    api_9.makeStringParameter('name', 'Package name', {
                        autocomplete: api_4.makeMetadataFormula((context, search) => __awaiter(void 0, void 0, void 0, function* () {
                            const url = url_2.withQueryParams(`https://npmjs.com/api/packages/search`, { q: String(search || '') });
                            const result = yield context.fetcher.fetch({ method: 'GET', url });
                            return result.body;
                        })),
                    }),
                    api_1.makeBooleanParameter('monthly', 'Show monthly download count instead of weekly', {
                        optional: true,
                        defaultValue: true,
                    }),
                ],
                network: { hasSideEffect: false, hasConnection: false },
                execute: ([name, monthly], context) => __awaiter(void 0, void 0, void 0, function* () {
                    const url = url_2.withQueryParams(`https://npmjs.com/api/packages/${name}`, { monthly: String(monthly) });
                    const result = yield context.fetcher.fetch({ method: 'GET', url });
                    return result.body;
                }),
            }),
            api_8.makeStringFormula({
                name: 'FakeGetPackageUrls',
                description: 'Retrieve a list of packages URLs, comma separated',
                examples: [],
                parameters: [api_7.makeStringArrayParameter('names', 'Names of packages to download')],
                network: { hasSideEffect: false, hasConnection: false },
                execute: ([names]) => __awaiter(void 0, void 0, void 0, function* () {
                    return names.map(name => `https://npmjs.com/api/packages/${name}`).join(',');
                }),
            }),
            api_5.makeNumericFormula({
                name: 'FakeDownloadPackage',
                description: 'Initiate a download of the package, increasing its popularity (this action formula is for tests)',
                examples: [],
                parameters: [
                    api_9.makeStringParameter('url', 'Url to a package'),
                    api_9.makeStringParameter('path', 'file path for download', { optional: true }),
                ],
                network: { hasSideEffect: true, hasConnection: false, requiresConnection: false },
                execute: ([url, _path], context) => __awaiter(void 0, void 0, void 0, function* () {
                    const fullUrl = url_2.withQueryParams(`https://npmjs.com/api/packages/${url}/download`);
                    const result = yield context.fetcher.fetch({ method: 'POST', url: fullUrl });
                    return result.body;
                }),
            }),
            api_5.makeNumericFormula({
                name: 'FakeAddPackage',
                description: 'Adds a fake package',
                examples: [],
                parameters: [api_9.makeStringParameter('name', 'Package name')],
                network: { hasSideEffect: true, hasConnection: true, requiresConnection: true },
                execute: ([name], context) => __awaiter(void 0, void 0, void 0, function* () {
                    const url = url_2.withQueryParams(`https://npmjs.com/api/packages`);
                    const result = yield context.fetcher.fetch({ method: 'POST', body: JSON.stringify({ name }), url });
                    return result.body;
                }),
            }),
        ],
    },
    syncTables: [
        api_10.makeSyncTable('Packages', exports.packageSchema, {
            name: 'SyncPackages',
            description: 'Pull down NPM packages.',
            examples: [],
            parameters: [
                api_9.makeStringParameter('search', 'Search string', { defaultValue: 'oy-vey' }),
                api_2.makeDateArrayParameter('dateRange', 'Date range', { optional: true }),
            ],
            network: { hasSideEffect: false, hasConnection: false },
            execute: ([search], context) => __awaiter(void 0, void 0, void 0, function* () {
                const { continuation } = context.sync;
                const url = url_2.withQueryParams(`https://npmjs.com/api/packages/${search}`, { continuation });
                const result = yield context.fetcher.fetch({ method: 'GET', url });
                return result.body;
            }),
        }),
        api_10.makeSyncTable('PackageVersions', exports.versionSchema, {
            name: 'SyncPackageVersions',
            description: 'Pull down NPM versions for a package.',
            examples: [],
            parameters: [
                api_9.makeStringParameter('name', 'Package name', {
                    autocomplete: api_4.makeMetadataFormula((context, search) => __awaiter(void 0, void 0, void 0, function* () {
                        const url = url_2.withQueryParams(`https://npmjs.com/api/packages/search`, { q: String(search || '') });
                        const result = yield context.fetcher.fetch({ method: 'GET', url });
                        return result.body;
                    })),
                }),
            ],
            network: { hasSideEffect: false, hasConnection: false },
            execute: ([pack], context) => __awaiter(void 0, void 0, void 0, function* () {
                const { continuation } = context.sync;
                const url = url_2.withQueryParams(`https://npmjs.com/api/packages/${pack}/versions`, { continuation });
                const result = yield context.fetcher.fetch({ method: 'GET', url });
                return result.body;
            }),
        }),
        api_3.makeDynamicSyncTable({
            packId: exports.FakeNpmPackId,
            name: 'DynamicPackageVersions',
            listDynamicUrls: api_4.makeMetadataFormula(() => __awaiter(void 0, void 0, void 0, function* () {
                return [
                    { display: 'coda-js', value: 'https://www.npmjs.com/package/coda-js' },
                ];
            })),
            getName: api_4.makeMetadataFormula((context) => __awaiter(void 0, void 0, void 0, function* () {
                const { dynamicUrl } = context.sync;
                const query = url_1.getQueryParams(dynamicUrl);
                return query.name;
            })),
            getSchema: api_4.makeMetadataFormula((context) => __awaiter(void 0, void 0, void 0, function* () {
                const { dynamicUrl } = context.sync;
                const query = url_1.getQueryParams(dynamicUrl);
                const name = ensure_1.ensureExists(query.name);
                return schema_4.makeSchema({
                    type: schema_1.ValueType.Array,
                    items: schema_2.makeObjectSchema(Object.assign(Object.assign({}, exports.versionSchema), { properties: Object.assign(Object.assign({}, exports.versionSchema.properties), { [name]: { type: schema_1.ValueType.Number } }) })),
                });
            })),
            getDisplayUrl: api_4.makeMetadataFormula((context) => __awaiter(void 0, void 0, void 0, function* () { return context.sync.dynamicUrl; })),
            formula: {
                name: 'SyncDynamicPackageVersions',
                description: 'Pull down NPM versions for a package.',
                examples: [],
                parameters: [
                    api_9.makeStringParameter('name', 'Package name', {
                        autocomplete: api_4.makeMetadataFormula((context, search) => __awaiter(void 0, void 0, void 0, function* () {
                            const url = url_2.withQueryParams(`https://npmjs.com/api/packages/search`, { q: String(search || '') });
                            const result = yield context.fetcher.fetch({ method: 'GET', url });
                            return result.body;
                        })),
                    }),
                ],
                network: { hasSideEffect: false, hasConnection: false },
                execute: ([pack], context) => __awaiter(void 0, void 0, void 0, function* () {
                    const { continuation, dynamicUrl } = context.sync;
                    const query = url_1.getQueryParams(dynamicUrl);
                    const name = ensure_1.ensureExists(query.name);
                    const url = url_2.withQueryParams(`https://npmjs.com/api/packages/${pack}/versions`, { continuation });
                    const result = yield context.fetcher.fetch({ method: 'GET', url });
                    return {
                        result: result.body.map((val, i) => (Object.assign(Object.assign({}, val), { [name]: i }))),
                    };
                }),
            },
        }),
    ],
};
exports.FakeNpmDefinition = sample_utils_1.fakeDefinitionToDefinition(FakeNpmDefinitionFake);
exports.FakeNpmMetadata = sample_utils_2.fakeDefinitionToMetadata(FakeNpmDefinitionFake);
