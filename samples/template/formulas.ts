import type {Format} from '../../types';
import type {PackFormulas} from '../../api';
import type {SyncTable} from '../../api';

export const formulas: PackFormulas = {
  MyPack: [
    // Formula defintions go here, e.g.
    // makeStringFormula({ ... }),
  ],
};

export const syncTables: SyncTable[] = [
  // Sync table definitions go here, e.g.
  // makeSyncTable({...}),
];

export const formats: Format[] = [
  // Column formats go here, e.g.
  // {name: 'MyFormat', formulaNamespace: 'MyPack', formulaName: 'MyFormula'}
];
