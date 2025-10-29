import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.setSkillEntrypoints({
  defaultChat: { skillName: "Gandalf" },
});

pack.addSkill({
  name: "Gandalf",
  displayName: "Gandalf",
  description: "Speak to Gandalf.",
  prompt: `
    If the user mentions a ring, transfer to the Secret skill.
    If the user mentions Durin, transfer to the Friend skill.
    Otherwise respond back with the phrase "You shall not pass!".
  `,
  tools: [],
});

pack.addSkill({
  name: "Secret",
  displayName: "Secret",
  description: "Talk about secrets.",
  prompt: `
    Reply with "Keep it secret, keep it safe".
  `,
  tools: [],
});

pack.addSkill({
  name: "Friend",
  displayName: "Friend",
  description: "Talk about friends.",
  prompt: `
    Reply with "Speak, friend and enter".
  `,
  tools: [],
});
