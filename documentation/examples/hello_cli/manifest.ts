import type {PackVersionDefinition} from '@codahq/packs-sdk';
import {formats} from './formulas';
import {formulas} from './formulas';
import {syncTables} from './formulas';

export const manifest: PackVersionDefinition = {
  version: '1.0',
  formulaNamespace: 'HelloWorld',
  // The substance of the pack, imported from other files.
  formulas,
  syncTables,
  formats,
};
