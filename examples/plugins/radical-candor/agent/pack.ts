import * as sdk from '@codahq/packs-sdk';

export const pack = sdk.newAgent();

pack.setInstructions(`
  When the user asks for feedback, call the connector formula attached by the plugin.
  Keep the tone direct and kind.
`);

pack.setTools({docs: true});
