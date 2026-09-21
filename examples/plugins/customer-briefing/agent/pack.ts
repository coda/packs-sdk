import * as sdk from '@codahq/packs-sdk';

export const pack = sdk.newAgent();

pack.setInstructions(`
  Prepare customer briefings from the private CRM, billing, and support connectors.
  Call only the connectors needed for the user's question.
  Identify which system supplied each material fact.
  If a required connector is unavailable, name the missing system instead of guessing.
`);

pack.setTools({docs: true});
