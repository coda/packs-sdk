import * as sdk from '@codahq/packs-sdk';

export const pack = sdk.newPack();

pack.addSkill({
  name: 'Coach',
  displayName: 'Coach',
  description: 'Gives candid feedback using the private connector.',
  prompt: `
    When the user asks for feedback, call the connector formula via tools.
    Keep the tone direct and kind.
  `,
  // After publish, set packId to the connector pack's numeric id.
  tools: [{type: sdk.ToolType.Pack}],
});
