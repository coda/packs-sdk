import {AuthenticationType} from '../types';
import {PackCategory} from '../types';
import type {PackDefinition} from '../types';
import type {PackFormulaMetadata} from '../api';
import type {PackVersionMetadata} from '../compiled_types';
import {Type} from '../index';
import {ValueType} from '../index';
import {deepFreeze} from '../helpers/object_utils';

export const FakePack: PackDefinition = deepFreeze({
  id: 424242,
  category: PackCategory.DataStorage,
  description: 'Fake Pack',
  exampleImages: [],
  exampleVideoIds: [],
  formats: [],
  formulas: [],
  logoPath: 'logo.png',
  name: 'Fake Pack',
  permissionsDescription: 'Some description about permissions',
  shortDescription: 'This is the default fake pack description',
  syncTables: [],
  version: '42.42.42',
});

export const FakePackVersionMetadata: PackVersionMetadata = deepFreeze({
  version: '42.42.42',
  defaultAuthentication: {
    type: AuthenticationType.QueryParamToken,
    paramName: 'authToken',
  },
  formats: [],
  formulas: [],
  permissionsDescription: 'Some description about permissions',
  syncTables: [],
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
