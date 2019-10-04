import {AuthenticationType} from '../types';
import {FakePackDefinition} from '../helpers/sample_utils';
import {FeatureSet} from '../types';
import {PackCategory} from '../types';
import {PackDefinition} from '../types';
import {PackMetadata} from '../compiled_types';
import {QuotaLimitType} from '../types';
import {SyncInterval} from '../types';
import {ValueType} from '../schema';
import {ensureExists} from '../helpers/ensure';
import {fakeDefinitionToDefinition} from '../helpers/sample_utils';
import {fakeDefinitionToMetadata} from '../helpers/sample_utils';
import {getQueryParams} from '../helpers/url';
import {makeBooleanParameter} from '../api';
import {makeConnectionMetadataFormula} from '../api';
import {makeDateArrayParameter} from '../api';
import {makeDynamicSyncTable} from '../api';
import {makeNumericFormula} from '../api';
import {makeObjectFormula} from '../api';
import {makeObjectSchema} from '../schema';
import {makeReferenceSchemaFromObjectSchema} from '../schema';
import {makeSchema} from '../schema';
import {makeStringArrayParameter} from '../api';
import {makeStringFormula} from '../api';
import {makeStringParameter} from '../api';
import {makeSyncTable} from '../api';
import {withQueryParams} from '../helpers/url';

export const FakeNpmProviderId = 9011;

export const FakeNpmPackId = 8003;
export const FakeNpmPackVersion = '5.2.3';

export const versionSchema = makeObjectSchema({
  type: ValueType.Object,
  identity: {
    packId: FakeNpmPackId,
    name: 'PackageVersion',
  },
  id: 'url',
  primary: 'url',
  properties: {
    url: {type: ValueType.String, id: true},
    version: {type: ValueType.String},
    downloadCount: {type: ValueType.Number},
  },
});

export const personSchema = makeObjectSchema({
  type: ValueType.Object,
  codaType: ValueType.Person,
  id: 'email',
  primary: 'name',
  properties: {
    email: {type: ValueType.String},
    name: {type: ValueType.String},
  },
});

export const packageSchema = makeObjectSchema({
  type: ValueType.Object,
  identity: {
    packId: FakeNpmPackId,
    name: 'Package',
  },
  id: 'url',
  primary: 'url',
  featured: ['packageName', 'downloadCount'],
  properties: {
    packageName: {type: ValueType.String},
    url: {type: ValueType.String, id: true},
    author: personSchema,
    downloadCount: {type: ValueType.Number},
    versions: {
      type: ValueType.Array,
      items: makeReferenceSchemaFromObjectSchema(versionSchema),
    },
  },
});

const FakeNpmDefinitionFake: FakePackDefinition = {
  id: FakeNpmPackId,
  name: 'NPM',
  shortDescription: 'npm',
  description: 'Node module repository',
  version: FakeNpmPackVersion,
  providerId: FakeNpmProviderId,
  category: PackCategory.Communication,
  logoPath: 'some/path',
  defaultAuthentication: {
    type: AuthenticationType.HeaderBearerToken,
    getConnectionName: makeConnectionMetadataFormula(async (_ctx, [search]) => `FakeConnection ${search}`),
    postSetup: [
      {
        name: 'getDefaultOptions1',
        description: 'Get default options',
        getOptionsFormula: makeConnectionMetadataFormula(async () => `FakeConnection getDefaultOptions1`),
      },
      {
        name: 'getDefaultOptions2',
        description: 'Get default options - second',
        getOptionsFormula: makeConnectionMetadataFormula(async () => `FakeConnection getDefaultOptions2`),
      },
    ],
  },
  minimumFeatureSet: FeatureSet.Pro,
  quotas: {
    [FeatureSet.Basic]: {
      monthlyLimits: {
        [QuotaLimitType.Action]: 10,
        [QuotaLimitType.Getter]: 100,
      },
      maximumSyncInterval: SyncInterval.Manual,
    },
    [FeatureSet.Pro]: {
      maximumSyncInterval: SyncInterval.Manual,
    },
  },
  formats: [
    {
      name: 'Package',
      formulaNamespace: 'NPM',
      formulaName: 'Package',
      hasNoConnection: true,
      instructions:
        'Paste the URL of a NPM package into the column. For example, "https://www.npmjs.com/package/[name]"',
      matchers: [/https:\/\/npmjs\.com\/package\/(\w+)/],
      placeholder: 'Link to NPM package',
    },
  ],
  formulas: {
    NPM: [
      makeObjectFormula({
        response: {
          schema: packageSchema,
        },
        name: 'Package',
        description: 'Get live data about a NPM package.',
        examples: [],
        parameters: [
          makeStringParameter('name', 'Package name', {
            autocomplete: makeConnectionMetadataFormula(async (context, search) => {
              const url = withQueryParams(`https://npmjs.com/api/packages/search`, {q: String(search || '')});
              const result = await context.fetcher!.fetch({method: 'GET', url});
              return result.body;
            }),
          }),
          makeBooleanParameter('monthly', 'Show monthly download count instead of weekly', {
            optional: true,
            defaultValue: true,
          }),
        ],
        network: {hasSideEffect: false, hasConnection: false},
        execute: async ([name, monthly], context) => {
          const url = withQueryParams(`https://npmjs.com/api/packages/${name}`, {monthly: String(monthly)});
          const result = await context.fetcher!.fetch({method: 'GET', url});
          return result.body;
        },
      }),
      makeStringFormula({
        name: 'FakeGetPackageUrls',
        description: 'Retrieve a list of packages URLs, comma separated',
        examples: [],
        parameters: [makeStringArrayParameter('names', 'Names of packages to download')],
        network: {hasSideEffect: false, hasConnection: false},
        execute: async ([names]: [string[]]) => {
          return names.map(name => `https://npmjs.com/api/packages/${name}`).join(',');
        },
      }),
      makeNumericFormula({
        name: 'FakeDownloadPackage',
        description: 'Initiate a download of the package, increasing its popularity (this action formula is for tests)',
        examples: [],
        parameters: [
          makeStringParameter('url', 'Url to a package'),
          makeStringParameter('path', 'file path for download', {optional: true}),
        ],
        network: {hasSideEffect: true, hasConnection: false, requiresConnection: false},
        execute: async ([url, _path], context) => {
          const fullUrl = withQueryParams(`https://npmjs.com/api/packages/${url}/download`);
          const result = await context.fetcher!.fetch({method: 'POST', url: fullUrl});
          return result.body;
        },
      }),
      makeNumericFormula({
        name: 'FakeAddPackage',
        description: 'Adds a fake package',
        examples: [],
        parameters: [makeStringParameter('name', 'Package name')],
        network: {hasSideEffect: true, hasConnection: true, requiresConnection: true},
        execute: async ([name], context) => {
          const url = withQueryParams(`https://npmjs.com/api/packages`);
          const result = await context.fetcher!.fetch({method: 'POST', body: JSON.stringify({name}), url});
          return result.body;
        },
      }),
    ],
  },
  syncTables: [
    makeSyncTable('Packages', packageSchema, {
      name: 'SyncPackages',
      description: 'Pull down NPM packages.',
      examples: [],
      parameters: [
        makeStringParameter('search', 'Search string', {defaultValue: 'oy-vey'}),
        makeDateArrayParameter('dateRange', 'Date range', {optional: true}),
      ],
      network: {hasSideEffect: false, hasConnection: false},
      execute: async ([search], context) => {
        const {continuation} = context.sync;
        const url = withQueryParams(`https://npmjs.com/api/packages/${search}`, {continuation});
        const result = await context.fetcher!.fetch({method: 'GET', url});
        return result.body;
      },
    }),
    makeSyncTable('PackageVersions', versionSchema, {
      name: 'SyncPackageVersions',
      description: 'Pull down NPM versions for a package.',
      examples: [],
      parameters: [
        makeStringParameter('name', 'Package name', {
          autocomplete: makeConnectionMetadataFormula(async (context, search) => {
            const url = withQueryParams(`https://npmjs.com/api/packages/search`, {q: String(search || '')});
            const result = await context.fetcher!.fetch({method: 'GET', url});
            return result.body;
          }),
        }),
      ],
      network: {hasSideEffect: false, hasConnection: false},
      execute: async ([pack], context) => {
        const {continuation} = context.sync;
        const url = withQueryParams(`https://npmjs.com/api/packages/${pack}/versions`, {continuation});
        const result = await context.fetcher!.fetch({method: 'GET', url});
        return result.body;
      },
    }),
    makeDynamicSyncTable(
      FakeNpmPackId,
      'DynamicPackageVersions',
      makeConnectionMetadataFormula(async context => {
        const {dynamicUrl} = context.sync!;
        const query = getQueryParams(dynamicUrl!);
        return query.name;
      }),
      makeConnectionMetadataFormula(async context => {
        const {dynamicUrl} = context.sync!;
        const query = getQueryParams(dynamicUrl!);
        const name = ensureExists(query.name);
        return makeSchema({
          type: ValueType.Array,
          items: makeObjectSchema({
            ...versionSchema,
            properties: {
              ...versionSchema.properties,
              [name]: {type: ValueType.Number},
            },
          }),
        });
      }),
      {
        name: 'SyncDynamicPackageVersions',
        description: 'Pull down NPM versions for a package.',
        examples: [],
        parameters: [
          makeStringParameter('name', 'Package name', {
            autocomplete: makeConnectionMetadataFormula(async (context, search) => {
              const url = withQueryParams(`https://npmjs.com/api/packages/search`, {q: String(search || '')});
              const result = await context.fetcher!.fetch({method: 'GET', url});
              return result.body;
            }),
          }),
        ],
        network: {hasSideEffect: false, hasConnection: false},
        execute: async ([pack], context) => {
          const {continuation, dynamicUrl} = context.sync;
          const query = getQueryParams(dynamicUrl!);
          const name = ensureExists(query.name);
          const url = withQueryParams(`https://npmjs.com/api/packages/${pack}/versions`, {continuation});
          const result = await context.fetcher!.fetch({method: 'GET', url});
          return {
            result: (result.body as any[]).map((val, i) => ({...val, [name]: i})),
          };
        },
      },
    ),
  ],
};

export const FakeNpmDefinition: PackDefinition = fakeDefinitionToDefinition(FakeNpmDefinitionFake);
export const FakeNpmMetadata: PackMetadata = fakeDefinitionToMetadata(FakeNpmDefinitionFake);
