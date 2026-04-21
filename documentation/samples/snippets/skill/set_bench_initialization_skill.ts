import * as sdk from "@codahq/packs-sdk";

const pack = sdk.newPack();

// BEGIN

pack.setBenchInitializationSkill({
  name: "${1:MySkill}",
  displayName: "${2:My skill}",
  description: "${3:My skill description.}",
  prompt: `
    $4$My prompt$
  `,
  tools: [
    // TODO: Add tools.
  ],
});
