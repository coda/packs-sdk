---
date: 2026-02-24
slug: gpt5-default
description: A rundown of the new agent features added to the SDK since the closed beta launched.
authors:
  - eric.koleda
categories:
  - Updates
---

# The default LLM model is now GPT5

As of February 12, 2026, the default LLM model used by Superhuman Go agents has been updated from OpenAI's GPT-4 to GPT-5. This update brings improved reasoning and performance across agents.

If you have an agent deployed on the platform, we recommend running a quick validation to ensure everything continues to work as expected. If you would like to revert back to GPT-4, you can do so by setting the `models` field on your skills:

```ts
pack.addSkill({
  // ...
  models: [
    { model: coda.SkillModel.OpenAIGPT4 },
  ],
});
```

You can read more about model selection in the [Skills guide][skills_models]. We aim to provide advance notice for model updates whenever possible and we'll continue sharing updates as the Go platform evolves.


[skills_models]: ../../agents/features/skills.md#models
