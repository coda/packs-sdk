import * as coda from '../../../index';

const pack = coda.newPack();

// BEGIN
// Replace all <text> with your own text
pack.addFormula({
  // This sets the return type of the formula.
  resultType: coda.ValueType.String,

  // This is the name that will be called in the formula builder.
  // Remember, your formula name cannot have spaces in it.
  name: '<Hello>',
  description: '<A Hello World example.>',

  // If your formula requires one or more inputs, you’ll define them here.
  // Create more parameters with /Parameter.
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: '<myParam>',
      description: '<My description>',
    }),
  ],

  // Everything inside this execute statement will happen anytime your Coda function is called in a doc.
  execute: async function ([myParam], context) {
    // Here, myParam is the first parameter you’ve defined above: the “name” input.
    return 'Hello ' + myParam + '!';
  },
});
