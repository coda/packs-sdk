"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderAgentPackTemplate = void 0;
function renderAgentPackTemplate(agentName) {
    const instructions = JSON.stringify(`You are ${agentName}. Keep replies short.`);
    return `import * as sdk from "@codahq/packs-sdk";

export const pack = sdk.newAgent();

// TODO: describe what your agent does. This is the only required call.
pack.setInstructions(${instructions});

pack.setTools({
  docs: true,
  // Least privilege: uncomment more tools as your agent needs them.
  // mail: true,
  // webSearch: true,
  // Grant access to other packs (e.g. Slack) by pack ID. Find IDs at
  // https://superhuman.com/store/connectors
  // connectors: [{packId: 1234}],
});

// Each installer gets a paused schedule at 9 AM in their time zone.
// Add TZID to use one time zone for all installers.
// pack.setDefaultScheduleTrigger({
//   rruleString: [
//     "DTSTART:20260101T090000",
//     "RRULE:FREQ=WEEKLY;BYDAY=MO;BYHOUR=9;BYMINUTE=0",
//   ].join("\\n"),
// });
`;
}
exports.renderAgentPackTemplate = renderAgentPackTemplate;
