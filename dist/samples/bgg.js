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
const npm_1 = require("./npm");
const types_2 = require("../types");
const api_types_1 = require("../api_types");
const sample_utils_1 = require("../helpers/sample_utils");
const sample_utils_2 = require("../helpers/sample_utils");
const api_1 = require("../api");
exports.FakeBggProviderId = 9010;
exports.FakeBggPackId = 8002;
exports.FakeBggPackVersion = '0.2.3';
exports.FakeBggPackVersionOld = '0.2.2';
const FakeBggDefinitionOldFake = {
    id: exports.FakeBggPackId,
    name: 'BoardGameGeek',
    shortDescription: 'Gaming plugged',
    description: 'Gaming unplugged',
    version: exports.FakeBggPackVersionOld,
    providerId: exports.FakeBggProviderId,
    category: types_2.PackCategory.Fun,
    logoPath: 'some/path',
    formats: [
        {
            name: 'BoardGame',
            formulaNamespace: 'BGG',
            formulaName: 'BoardGame',
            matchers: [/https:\/\/boardgamegeek\.com\/boardgame\/(\d+)/],
        },
    ],
    formulas: {
        BGG: [
            {
                resultType: api_types_1.Type.string,
                name: 'BoardGame',
                description: 'Retrieve a board game.',
                examples: [],
                parameters: [
                    {
                        name: 'id',
                        type: api_types_1.Type.string,
                        description: 'ID of a board game.',
                    },
                ],
                network: { hasSideEffect: false, hasConnection: true, requiresConnection: true },
                execute: ([id], context) => __awaiter(this, void 0, void 0, function* () {
                    const url = `https://boardgamegeek.com/boardgame/${id}`;
                    const result = yield context.fetcher.fetch({ method: 'GET', url });
                    return result.body;
                }),
            },
        ],
    },
};
exports.FakeBggDefinitionOld = sample_utils_1.fakeDefinitionToDefinition(FakeBggDefinitionOldFake);
exports.FakeBggMetadataOld = sample_utils_2.fakeDefinitionToMetadata(FakeBggDefinitionOldFake);
const FakeBggDefinitionFake = {
    id: exports.FakeBggPackId,
    name: 'BoardGameGeek',
    shortDescription: 'Gaming plugged.',
    description: 'Gaming unplugged.',
    version: exports.FakeBggPackVersion,
    providerId: npm_1.FakeNpmProviderId,
    category: types_2.PackCategory.Fun,
    logoPath: 'some/path',
    defaultAuthentication: {
        type: types_1.AuthenticationType.OAuth2,
        authorizationUrl: 'https://boardgamegeek.com/oauth/authorize',
        tokenUrl: 'https://boardgamegeek.com/oauth/token',
        clientIdEnvVarName: 'FAKE_BGG_CLIENT_ID',
        clientSecretEnvVarName: 'FAKE_BGG_CLIENT_SECRET',
        scopes: ['games', 'favorites'],
        getConnectionNameFormula: api_1.makeGetConnectionNameFormula((context) => __awaiter(this, void 0, void 0, function* () {
            const request = {
                method: 'GET',
                url: 'https://boardgamegeek.com/me',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const response = yield context.fetcher.fetch(request);
            return response.body.profile.display_name;
        })),
    },
    systemConnectionAuthentication: {
        type: types_1.AuthenticationType.QueryParamToken,
        paramName: 'apikey',
    },
    formats: [
        {
            name: 'BoardGame',
            formulaNamespace: 'BGG',
            formulaName: 'BoardGame',
            matchers: [/https:\/\/boardgamegeek\.com\/boardgame\/(\d+)/],
        },
    ],
    formulas: {
        BGG: [
            {
                resultType: api_types_1.Type.object,
                name: 'BoardGame',
                description: 'Retrieve a board game',
                examples: [],
                parameters: [
                    {
                        name: 'url',
                        type: api_types_1.Type.string,
                        description: 'Url to a board game',
                    },
                ],
                network: { hasSideEffect: false, hasConnection: true, requiresConnection: true },
                execute: ([id], context) => __awaiter(this, void 0, void 0, function* () {
                    const url = `https://boardgamegeek.com/boardgame/${id}`;
                    const result = yield context.fetcher.fetch({ method: 'GET', url });
                    return result.body;
                }),
            },
        ],
    },
};
exports.FakeBggDefinition = sample_utils_1.fakeDefinitionToDefinition(FakeBggDefinitionFake);
exports.FakeBggMetadata = sample_utils_2.fakeDefinitionToMetadata(FakeBggDefinitionFake);
