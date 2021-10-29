import * as coda from '../..';

export const myPack = coda.newPack();

function doThrow() {
  throw new Error('test');
}

myPack.addFormula({
  name: 'Throw',
  description: 'A Hello World example.',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'name',
      description: 'The name you would like to say hello to.',
    }),
  ],
  resultType: coda.ValueType.String,
  async execute([name]) {
    doThrow();
    return 'Hello ' + name + '!';
  },
});

export const pack = {...myPack};
