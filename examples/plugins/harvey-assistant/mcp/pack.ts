import * as sdk from '@codahq/packs-sdk';

export const pack = sdk.newPack();

pack.addNetworkDomain('harvey.ai');

pack.addMCPServer({
  name: 'Harvey',
  endpointUrl: 'https://mcp.harvey.ai/mcp',
});

pack.setUserAuthentication({
  type: sdk.AuthenticationType.OAuth2,
  useDynamicClientRegistration: true,
  useProofKeyForCodeExchange: true,
  instructionsUrl: 'https://developers.harvey.ai/guides/harvey_mcp',
});
