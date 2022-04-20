import {AuthenticationType} from '../types';
import {PackCategory} from '../types';
import type {PackDefinition} from '../types';
import type {PackFormulaMetadata} from '../api';
import type {PackVersionMetadata} from '../compiled_types';
import {Type} from '../index';
import {ValueType} from '../index';
import {deepFreeze} from '../helpers/object_utils';

const BaseFakePack = {
  version: '42.42.42',
  formats: [],
  formulas: [],
  syncTables: [],
  permissionsDescription: 'Some description about permissions',
};

export const FakePack: PackDefinition = deepFreeze({
  ...BaseFakePack,
  id: 424242,
  category: PackCategory.DataStorage,
  description: 'Fake Pack',
  exampleImages: [],
  exampleVideoIds: [],
  logoPath: 'logo.png',
  name: 'Fake Pack',
  shortDescription: 'This is the default fake pack description',
});

export const FakePackVersionMetadata: PackVersionMetadata = deepFreeze({
  ...BaseFakePack,
  networkDomains: ['example.com'],
  defaultAuthentication: {
    type: AuthenticationType.QueryParamToken,
    paramName: 'authToken',
  },
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

export function createFakePackVersionMetadata(opts: Partial<PackVersionMetadata> = {}): PackVersionMetadata {
  return {...FakePackVersionMetadata, ...opts};
}

export function createFakePackFormulaMetadata(opts: Partial<PackFormulaMetadata> = {}): PackFormulaMetadata {
  return {...FakePackFormulaMetadata, ...opts};
}
