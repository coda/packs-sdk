import {AuthenticationType} from '../types';
import {FakePackDefinition} from '../helpers/sample_utils';
import {PackCategory} from '../types';
import {PackDefinition} from '../types';
import {PackMetadata} from '../compiled_types';
import {ValueType} from '../schema';
import {fakeDefinitionToDefinition} from '../helpers/sample_utils';
import {fakeDefinitionToMetadata} from '../helpers/sample_utils';
import {makeBooleanParameter} from '../api';
import {makeNumericFormula} from '../api';
import {makeObjectFormula} from '../api';
import {makeSchema} from '../schema';
import {makeStringArrayParameter} from '../api';
import {makeStringFormula} from '../api';
import {makeStringParameter} from '../api';
import {withQueryParams} from '../helpers/url';

export const FakeNpmProviderId = 9011;

export const FakeNpmPackId = 8003;
export const FakeNpmPackVersion = '5.2.2';

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
  },
  formats: [
    {
      name: 'Package',
      formulaNamespace: 'NPM',
      formulaName: 'Package',
      hasNoConnection: true,
      matchers: [/https:\/\/npmjs\.com\/package\/(\w+)/],
    },
  ],
  formulas: {
    NPM: [
      makeObjectFormula({
        response: {
          schema: makeSchema({
            type: ValueType.Object,
            identity: {
              packId: FakeNpmPackId,
              name: 'Package',
            },
            properties: {
              package: {type: ValueType.String, primary: true},
              url: {type: ValueType.String},
              downloadCount: {type: ValueType.Number},
            },
          }),
        },
        name: 'Package',
        description: 'Retrieve a package',
        examples: [],
        parameters: [
          makeStringParameter('name', 'Package name'),
          makeBooleanParameter('monthly', 'Show monthly download count instead of weekly', {optional: true}),
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
        parameters: [makeStringParameter('url', 'Url to a package')],
        network: {hasSideEffect: true, hasConnection: false, requiresConnection: false},
        execute: async ([name], context) => {
          const url = withQueryParams(`https://npmjs.com/api/packages/${name}/download`);
          const result = await context.fetcher!.fetch({method: 'POST', url});
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
};

export const FakeNpmDefinition: PackDefinition = fakeDefinitionToDefinition(FakeNpmDefinitionFake);
export const FakeNpmMetadata: PackMetadata = fakeDefinitionToMetadata(FakeNpmDefinitionFake);
