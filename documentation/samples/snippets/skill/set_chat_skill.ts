import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.setChatSkill({
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
