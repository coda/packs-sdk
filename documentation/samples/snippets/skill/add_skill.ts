import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.addSkill({
  // Unique identifier, internal only.
  name: "${1:SkillIdentifier}",

  // User-visible display name (shown on the agent listing).
  displayName: "${2:Skill display name}",

  // Description of the skill. Used for routing and may be user-visible.
  description: "${3:Describe the skill.}",

  // A prompt that instructs the LLM how to perform the task, internal-only.
  prompt: "${4:Explain the steps the model should follow.}",

  // An optional set of tools the LLM can leverage.
  tools: [],
});
