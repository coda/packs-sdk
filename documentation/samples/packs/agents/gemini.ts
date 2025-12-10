import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

const GeminiModel = "gemini-2.0-flash";

pack.setChatSkill({
  name: "GenerateReply",
  displayName: "Generate a reply.",
  description: "Generates a reply to the user.",
  prompt: `
    Always start by calling the GetGeminiReply tool.
    - In the messages parameter, pass all previous messages with role=user or
      role=assistant, except those that have "editorText" in the ID.
    - In the screenContent parameter, pass the content of the most recent
      message that has role=user and has "editorText" in the ID.
    - In the userContext parameter, pass the user context and timezone.
    Output the tool output exactly, including emojis, minus any surrounding
    quotes. Don't output anything except for the tool output.

    ## Example
    System prompt:
      The following JSON object describes the user asking the question:
      {"name":"John Doe","email":"john@example.com"}
      Today's date is Wed, Oct 15, 2025, GMT-04:00.
      Show all dates and times in the 'America/New_York' timezone.
    Message history: [
      { "role": "user", "content": "Cat", "id": "msg_editorText_abc" },
      { "role": "user", "content": "Hello" },
      { "role": "assistant", "content": "Howdy John" },
      { "role": "user", "content": "Dog", "id": "msg_editorText_abc" },
      { "role": "user", "content": "Goodbye" },
    ]
    Tool call: GetGeminiReply({
      messages: ["user:Hello", "model:Howdy John", "user:Goodbye"],
      screenContext: "Dog",
      userContext: "{
        \"name\":\"John Doe\",
        \"email\":\"john@example.com\",
        \"timezone\": \"America/New_York\"
      }",
    })
    Tool output: "Bye John"
    Agent output: Bye John
  `,
  tools: [
    // All the formulas in this Pack.
    { type: coda.ToolType.Pack },
  ],
});

pack.addFormula({
  name: "GetGeminiReply",
  description: "Passes a message to Gemini and gets a reply.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.StringArray,
      name: "messages",
      description: `
        The messages in the chat history, as an array of strings. Prefix each
        message with either 'user:' or 'model:', depending on the source.
      `,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "screenContext",
      description: "Context about what is on the user's screen.",
      optional: true,
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "userContext",
      description: `
        Context about the user that comes from the system prompt, such as
        their name and email address.
      `,
      optional: true,
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async function (args, context) {
    let [messages, screenContext, userContext] = args;
    let payload = {
      contents: messages.map(message => {
        // Break apart the role and message.
        let [_, role, text] = message.match(/(?:(\w+)\s*\:\s*)?(.*)/);
        return {
          role: role,
          parts: [{ text: text }],
        };
      }),
      system_instruction: {
        parts: [
          {
            text: `
              Append a space and the gem stone emoji (code point U+1F48E)
              to every reply.

              ## Use this context to answer the question

              #### Screen context
              ${screenContext}

              #### User context
              ${userContext}
            `,
          },
        ],
      },
    };
    let response = await context.fetcher.fetch({
      method: "POST",
      url: "https://generativelanguage.googleapis.com/v1beta/models/" +
        `${GeminiModel}:generateContent`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    let reply = response.body.candidates[0].content.parts
      .map(p => p.text).join("");
    return reply;
  },
});

pack.setSystemAuthentication({
  type: coda.AuthenticationType.CustomHeaderToken,
  headerName: "X-goog-api-key",
  instructionsUrl: "https://aistudio.google.com/app/apikey",
});

pack.addNetworkDomain("googleapis.com");
