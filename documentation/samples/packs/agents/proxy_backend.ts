import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// This example demonstrates proxy mode, which allows developers to bypass
// the initial LLM call and immediately execute their backend API.
// This reduces latency and ensures reliable tool execution.

// Enable proxy mode at the pack level
pack.setProxyMode({
  enabled: true,
  initialToolCall: {
    // This formula will be called immediately with the user's first message
    // The entire user message will be passed as the first parameter
    formulaName: "CallBackend",
  },
});

pack.setSkillEntrypoints({
  defaultChat: { skillName: "ProxyAgent" },
});

pack.addSkill({
  name: "ProxyAgent",
  displayName: "Proxy Backend Agent",
  description: "An agent that proxies requests to an external AI backend.",
  prompt: `
    You are an agent that works with an external AI system.
    The external system has already processed the user's request.
    Your job is to:
    1. Review the response from the backend
    2. Format it nicely for the user
    3. Answer any follow-up questions using your own knowledge
  `,
  tools: [
    {
      type: coda.ToolType.Pack,
    },
  ],
});

pack.addFormula({
  name: "CallBackend",
  description: "Calls the external AI backend with the user's message.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "userMessage",
      description: "The message from the user to send to the backend.",
    }),
  ],
  resultType: coda.ValueType.String,
  cacheTtlSecs: 0,
  execute: async function (args, context) {
    let [userMessage] = args;

    // In a real implementation, this would call your actual backend API:
    // const response = await fetch("https://your-backend.com/api/chat", {
    //   method: "POST",
    //   body: JSON.stringify({ message: userMessage }),
    //   headers: { "Content-Type": "application/json" }
    // });
    // return await response.text();

    // For this example, we'll simulate a backend response
    return "Backend AI Response: I received your message " + userMessage + "." +
           "This response came directly from the external AI system without " +
           "going through the initial LLM loop, reducing latency significantly";
  },
});
