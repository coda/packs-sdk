import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.setSkillEntrypoints({
  defaultChat: { skillName: "${1:MySkill}" },
});
