import {AuthenticationType} from '../types';
import {FakePackDefinition} from '../helpers/sample_utils';
import {PackCategory} from '../types';
import {PackDefinition} from '../types';
import {PackMetadata} from '../compiled_types';
import {Type} from '../api_types';
import {fakeDefinitionToDefinition} from '../helpers/sample_utils';
import {fakeDefinitionToMetadata} from '../helpers/sample_utils';
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
      {
        resultType: Type.object,
        schema: {
          type: 'object',
          properties: {
            package: {type: 'string', primary: true},
            url: {type: 'string'},
            downloadCount: {type: 'number'},
          },
        },
        name: 'Package',
        description: 'Retrieve a package',
        examples: [],
        parameters: [
          {
            name: 'name',
            type: Type.string,
            description: 'Package name',
          },
          {
            name: 'monthly',
            type: Type.boolean,
            description: 'Show monthly download count instead of weekly',
            optional: true,
          },
        ],
        network: {hasSideEffect: false, hasConnection: false},
        execute: async ([name, monthly], context) => {
          const url = withQueryParams(`https://npmjs.com/api/packages/${name}`, {monthly: String(monthly)});
          const result = await context.fetcher!.fetch({method: 'GET', url});
          return result.body;
        },
      },
      {
        resultType: Type.number,
        name: 'FakeDownloadPackage',
        description: 'Initiate a download of the package, increasing its popularity (this action formula is for tests)',
        examples: [],
        parameters: [
          {
            name: 'url',
            type: Type.string,
            description: 'Url to a package',
          },
        ],
        network: {hasSideEffect: true, hasConnection: false, requiresConnection: false},
        execute: async ([name, monthly], context) => {
          const url = withQueryParams(`https://npmjs.com/api/packages/${name}/download`, {monthly: String(monthly)});
          const result = await context.fetcher!.fetch({method: 'POST', url});
          return result.body;
        },
      },
      {
        resultType: Type.number,
        name: 'FakeAddPackage',
        description: 'Adds a fake package',
        examples: [],
        parameters: [
          {
            name: 'name',
            type: Type.string,
            description: 'Package name',
          },
        ],
        network: {hasSideEffect: true, hasConnection: true, requiresConnection: true},
        execute: async ([name], context) => {
          const url = withQueryParams(`https://npmjs.com/api/packages`);
          const result = await context.fetcher!.fetch({method: 'POST', body: JSON.stringify({name}), url});
          return result.body;
        },
      },
    ],
  },
};

export const FakeNpmDefinition: PackDefinition = fakeDefinitionToDefinition(FakeNpmDefinitionFake);
export const FakeNpmMetadata: PackMetadata = fakeDefinitionToMetadata(FakeNpmDefinitionFake);
