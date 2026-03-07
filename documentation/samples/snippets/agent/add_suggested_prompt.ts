import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.addSuggestedPrompt({
  name: "${1:MyPrompt}",
  displayName: "${2:My Prompt}",
  prompt: `
    $4$My prompt$
  `,
});
