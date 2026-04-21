import * as sdk from "@codahq/packs-sdk";

const pack = sdk.newPack();

// BEGIN

pack.addSuggestedPrompt({
  name: "${1:MyPrompt}",
  displayName: "${2:My Prompt}",
  prompt: `
    $4$My prompt$
  `,
});
