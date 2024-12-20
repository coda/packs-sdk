import * as coda from '../..';
import vm from 'vm';

export const pack = coda.newPack();

pack.addFormula({
  name: 'HelloWorld',
  description: 'Returns "Hello World".',
  parameters: [],
  resultType: coda.ValueType.String,
  execute: async ([], _context) => {
    vm.runInNewContext('1');
    return 'Hello World';
  },
});
