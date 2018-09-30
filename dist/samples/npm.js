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
const api_types_1 = require("../api_types");
const sample_utils_1 = require("../helpers/sample_utils");
const sample_utils_2 = require("../helpers/sample_utils");
const url_1 = require("../helpers/url");
exports.FakeNpmProviderId = 9011;
exports.FakeNpmPackId = 8003;
exports.FakeNpmPackVersion = '5.2.2';
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
            matchers: [/https:\/\/npmjs\.com\/package\/(w+)/],
        },
    ],
    formulas: {
        NPM: [
            {
                resultType: api_types_1.Type.object,
                schema: {
                    type: 'object',
                    properties: {
                        package: { type: 'string', primary: true },
                        url: { type: 'string' },
                        downloadCount: { type: 'number' },
                    },
                },
                name: 'Package',
                description: 'Retrieve a package',
                examples: [],
                parameters: [
                    {
                        name: 'name',
                        type: api_types_1.Type.string,
                        description: 'Package name',
                    },
                    {
                        name: 'monthly',
                        type: api_types_1.Type.boolean,
                        description: 'Show monthly download count instead of weekly',
                        optional: true,
                    },
                ],
                network: { hasSideEffect: false, hasConnection: false },
                execute: ([name, monthly], context) => __awaiter(this, void 0, void 0, function* () {
                    const url = url_1.withQueryParams(`https://npmjs.com/api/packages/${name}`, { monthly: String(monthly) });
                    const result = yield context.fetcher.fetch({ method: 'GET', url });
                    return result.body;
                }),
            },
            {
                resultType: api_types_1.Type.number,
                name: 'FakeDownloadPackage',
                description: 'Initiate a download of the package, increasing its popularity (this action formula is for tests)',
                examples: [],
                parameters: [
                    {
                        name: 'url',
                        type: api_types_1.Type.string,
                        description: 'Url to a package',
                    },
                ],
                network: { hasSideEffect: true, hasConnection: false, requiresConnection: false },
                execute: ([name, monthly], context) => __awaiter(this, void 0, void 0, function* () {
                    const url = url_1.withQueryParams(`https://npmjs.com/api/packages/${name}/download`, { monthly: String(monthly) });
                    const result = yield context.fetcher.fetch({ method: 'POST', url });
                    return result.body;
                }),
            },
            {
                resultType: api_types_1.Type.number,
                name: 'FakeAddPackage',
                description: 'Adds a fake package',
                examples: [],
                parameters: [
                    {
                        name: 'name',
                        type: api_types_1.Type.string,
                        description: 'Package name',
                    },
                ],
                network: { hasSideEffect: true, hasConnection: true, requiresConnection: true },
                execute: ([name], context) => __awaiter(this, void 0, void 0, function* () {
                    const url = url_1.withQueryParams(`https://npmjs.com/api/packages`);
                    const result = yield context.fetcher.fetch({ method: 'POST', body: JSON.stringify({ name }), url });
                    return result.body;
                }),
            },
        ],
    },
};
exports.FakeNpmDefinition = sample_utils_1.fakeDefinitionToDefinition(FakeNpmDefinitionFake);
exports.FakeNpmMetadata = sample_utils_2.fakeDefinitionToMetadata(FakeNpmDefinitionFake);
