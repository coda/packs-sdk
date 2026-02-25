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

As of February 12, 2026 the default LLM model used by Superhuman Go agents changed from OpenAI's GPT4 to GPT5. While we intend to provide early warning about model changes, in this case we weren't able to provide that notice. If you have an existing agent deployed on the platform we urge you to test it and ensure it still works reliably.

If you would like to revert back to GPT4, you can do so by setting the `models` field on your skills:

```ts
pack.addSkill({
  // ...
  models: [
    { model: coda.SkillModel.OpenAIGPT4 },
  ],
});
```

You can read more about model selection in the [Skills guide][skills_models].


[skills_models]: ../../agents/features/skills.md#models
