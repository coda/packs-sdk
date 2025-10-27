import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addSkill({
  name: "GenAlpha",
  displayName: "Make Gen Alpha",
  description: "Make your writing use more Generation Alpha slang.",
  prompt: `
    You are a writing agent that specializes in Generation Alpha slang.
    Looks at the text the user is writing.
    Replace their words and phrases with the equivalent Gen Alpha slang.
    Use the Rewrite tool to make those suggestions.
    Only make a single call to the Rewrite tool, passing in all suggestions.
    Only pass in one rewrite per-paragraph, combining all the changes for that 
    paragraph.
    For each suggestion, include a very brief explanation (10 words or less).
  `,
  tools: [
    {
      type: coda.ToolType.ScreenAnnotation,
      annotation: { type: coda.ScreenAnnotationType.Rewrite },
    },
  ],
});
