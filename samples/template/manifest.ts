import {PackCategory} from '../../types';
import type {PackDefinition} from '../../types';
import {formats} from './formulas';
import {formulas} from './formulas';
import {syncTables} from './formulas';

export const manifest: PackDefinition = {
  id: 123,
  name: 'MyPack',
  shortDescription: '',
  description: '',
  version: '0.0.1',
  exampleImages: [],
  providerId: 456,
  category: PackCategory.Fun,
  logoPath: 'logo.png',

  formulas,
  syncTables,
  formats,
};
