import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// How long to keep checking the flip status in a single tool call.
// The LLM will chain together multiple tool calls.
const MaxRuntimeSeconds = 30;

// How long to pause between checking the flip results.
const SleepTimeSeconds = 5;

pack.setSkillEntrypoints({
  defaultChat: { skillName: "FlipCoin" },
});

pack.addSkill({
  name: "FlipCoin",
  displayName: "Flip a coin",
  description: "Flips a coin and gets the result.",
  prompt: `
    1. If not provided, ask the user how many seconds to flip the coin for.
    2. Call StartCoinFlip to begin the coin flip.
    3. Call GetResult to check the status of the flip, and possibly get the
       result.
    4. If the flip isn't complete (isComplete is false), go back to step 3 and
       call GetResult again.
    5. Tell the user the result of the coin flip. Only do this if the flip is
       complete. If not, always call GetResult again.

    Don't stop until you have a result.
    You must get a result, no matter how long it takes.
  `,
  tools: [
    {
      type: coda.ToolType.Pack,
    },
  ],
});

const FlipSchema = coda.makeObjectSchema({
  properties: {
    isComplete: { type: coda.ValueType.Boolean },
    result: { type: coda.ValueType.String },
  },
  displayProperty: "result",
});

pack.addFormula({
  name: "StartCoinFlip",
  description: "Starts a coin flip. Returns the ID of the flip.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "seconds",
      description: "How long the coin should flip for, in seconds.",
    }),
  ],
  resultType: coda.ValueType.String,
  cacheTtlSecs: 0,
  execute: async function (args, context) {
    let [seconds] = args;
    let flipId = startFlip(seconds);
    return flipId;
  },
});

pack.addFormula({
  name: "GetResult",
  description: "Gets the result of a coin flip.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "flipId",
      description: "The ID of the coin flip.",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: FlipSchema,
  cacheTtlSecs: 0,
  execute: async function (args, context) {
    let [flipId] = args;
    let start = new Date();
    let max = start.getTime() + (MaxRuntimeSeconds * 1000);
    let result;
    do {
      if (result) {
        // Not the first time through the loop, pause for a few seconds.
        await Atomics.wait(
          new Int32Array(
            new SharedArrayBuffer(4)), 0, 0, SleepTimeSeconds * 1000);
      }
      result = await getResult(flipId);
    } while (!result.isComplete && Date.now() < max);
    return result;
  },
});

function startFlip(seconds: number) {
  // In a real agent this would make a request to an API and get back an ID.
  // In this example, we just encode the end time in the ID itself.
  let now = new Date();
  let end = new Date(now.getTime() + (seconds * 1000));
  return Buffer.from(end.toUTCString()).toString("base64");
}

function getResult(flipId: string) {
  // In a real agent this would make a request to get the status / result.
  // In this example, we just decode the end time from the ID.
  let end = new Date(Buffer.from(flipId, "base64").toString());
  let now = new Date();
  if (now > end) {
    return {
      isComplete: true,
      result: Math.random() > 0.5 ? "heads" : "tails",
    };
  } else {
    return {
      isComplete: false,
    };
  }
}
