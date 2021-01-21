import {AuthenticationType} from '../types';
import {PackCategory} from '../types';
import type {PackDefinition} from '../types';
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
  formulas: [],
  logoPath: 'logo.png',
  name: 'Fake Pack',
  permissionsDescription: 'Some description about permissions',
  providerId: 12345,
  shortDescription: 'This is the default fake pack description',
  syncTables: [],
  version: '42.42.42',
  formulaNamespace: 'Fake',
});

export function createFakePack(opts: Partial<PackDefinition> = {}): PackDefinition {
  return {...FakePack, ...opts};
}
