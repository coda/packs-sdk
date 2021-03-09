import {AuthenticationType} from '../types';
import {PackCategory} from '../types';
import type {PackDefinition} from '../types';
import type {PackFormulaMetadata} from '../api';
import type {PackMetadata} from '../compiled_types';
import {Type} from '../index';
import {ValueType} from '../index';
import {deepFreeze} from '../helpers/object_utils';

export const FakePack: PackDefinition = deepFreeze({
  id: 424242,
  authentication: {
    type: AuthenticationType.OAuth2,
    requiresEndpointUrl: false,
  },
  category: PackCategory.DataStorage,
  description: 'Fake Pack',
  exampleImages: [],
  exampleVideoIds: [],
  formats: [],
  formulas: {},
  logoPath: 'logo.png',
  name: 'Fake Pack',
  permissionsDescription: 'Some description about permissions',
  providerId: 12345,
  shortDescription: 'This is the default fake pack description',
  syncTables: [],
  version: '42.42.42',
});

export const FakePackMetadata: PackMetadata = deepFreeze({
  id: 424242,
  defaultAuthentication: {
    type: AuthenticationType.QueryParamToken,
    paramName: 'authToken',
  },
  category: PackCategory.DataStorage,
  description: 'Fake Pack',
  exampleImages: [],
  exampleVideoIds: [],
  formats: [],
  formulas: [],
  logoPath: 'logo.png',
  name: 'Fake Pack',
  permissionsDescription: 'Some description about permissions',
  providerId: 12345,
  shortDescription: 'This is the default fake pack description',
  syncTables: [],
  version: '42.42.42',
});

export const FakePackFormulaMetadata: PackFormulaMetadata = deepFreeze({
  schema: {
    type: ValueType.String,
  },
  name: 'MyFormula',
  description: 'Formula description',
  parameters: [],
  examples: [],
  resultType: Type.string,
});

export function createFakePack(opts: Partial<PackDefinition> = {}): PackDefinition {
  return {...FakePack, ...opts};
}

export function createFakePackMetadata(opts: Partial<PackMetadata> = {}): PackMetadata {
  return {...FakePackMetadata, ...opts};
}

export function createFakePackFormulaMetadata(opts: Partial<PackFormulaMetadata> = {}): PackFormulaMetadata {
  return {...FakePackFormulaMetadata, ...opts};
}
