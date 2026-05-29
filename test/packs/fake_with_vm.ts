import * as sdk from '../..';
import vm from 'vm';

export const pack = sdk.newPack();

pack.addFormula({
  name: 'HelloWorld',
  description: 'Returns "Hello World".',
  parameters: [],
  resultType: sdk.ValueType.String,
  execute: async ([], _context) => {
    vm.runInNewContext('1');
    return 'Hello World';
  },
});
