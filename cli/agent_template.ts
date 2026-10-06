export function renderAgentPackTemplate(agentName: string): string {
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

// Fire on a schedule. Runs at install time for installers. Edit the RRULE to
// taste; frequencies below hourly are rejected. Reinstall the agent after
// changing triggers — installed copies do not live-sync from later uploads.
// pack.setDefaultScheduleTrigger({
//   rruleString: [
//     "DTSTART;TZID=America/New_York:20260101T090000",
//     "RRULE:FREQ=WEEKLY;BYDAY=MO;BYHOUR=9;BYMINUTE=0",
//   ].join("\\n"),
// });
`;
}
