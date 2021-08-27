import * as coda from '../../../index';

// BEGIN
// **This import statement gives you access to all parts of the Coda Packs SDK. Uncomment to start!**
// import * as coda from '@codahq/packs-sdk';

// This line creates your new Pack.
export const pack = coda.newPack();

// When using the fetcher, this is the domain of the API that your pack makes fetcher requests to.
pack.addNetworkDomain('baconipsum.com');

// This line adds a new formula to this Pack.
pack.addFormula({
  // Remember, the formula name cannot have spaces in it.
  name: 'FetchIpsum',
  description: 'A simple fetcher example returning some lorem ipsum copy.',

  // This formula does not need any user inputs, so the parameters field is empty.
  parameters: [],

  /* Everything inside this execute statement will happen anytime your Coda function is called in a doc.
  An array of all user inputs is passed as the 1st parameter.
  The context object is always the 2nd parameter and is used for fetching data and debugging. */
  execute: async function ([], context) {
    const url = 'https://baconipsum.com/api/?type=meat-and-filler';

    // context.fetcher.fetch allows you to pull in external data, specifying things like the HTTP method and URL.
    const response = await context.fetcher.fetch({method: 'GET', url});

    // The entire body of the response contains the lorem ipsum text to be returned.
    return response.body;
  },

  // In this formula, we're returning a string.
  resultType: coda.ValueType.String,
});
