---
name: create-agent-pack
description: Create, build, validate, and upload a Packs SDK agent (pack.ts using sdk.newAgent()) to your Coda/Superhuman account, including registering an API token, wiring up tools (docs/mail/webSearch/connectors) and triggers (schedule/while-writing), and installing it from the agent directory. Use this whenever a developer wants to build a Coda/Superhuman agent pack, test a schedule trigger or rrule string, or asks to "create an agent" / "upload a pack" / "make a pack.ts". Also use for iterating on an existing agent pack: adding tools, changing instructions, adding a second pack, or adding a trigger.
---

# Create an agent pack

Builds a minimal agent on top of the Packs SDK (`sdk.newAgent()`) and publishes it to a Coda/Superhuman
account. Full SDK docs: https://docs.superhuman.com/packs/build/latest.

An agent is defined almost entirely by three builder calls on `pack.ts`:

```typescript
import * as sdk from "@codahq/packs-sdk";

export const pack = sdk.newAgent();
pack.setInstructions("Print hello world.");   // the only required call
pack.setTools({ docs: true, mail: true, webSearch: true, connectors: [{packId: 1000}] });
```

See `references/api.md` for the full `setTools`/trigger signatures (connector formula filters,
`setDefaultScheduleTrigger`, `setDefaultWhileWritingTrigger`) and how to look up a connector's pack ID.

## Work in your own directory

Work in a directory that isn't a checkout of this SDK's own repo — a real pack author doesn't have this
repo checked out, they just install the **published** `@codahq/packs-sdk` package. This is what gives
you the `packs` CLI (`npx packs <cmd>`).

Each pack lives in its own directory. `.coda.json` (your API token) and `.coda-pack.json` (the pack's
ID) are stored **per-directory**, not globally — see "Two packs, or a second install" below before
reusing a directory for a second pack.

## Pre-setup (once per machine)

```bash
# Node must be >= 22. If your shell defines node/npm as a lazy nvm loader, unset it first:
unset -f node npm npx pnpm corepack yarn 2>/dev/null
node --version   # confirm >= 22

mkdir <dir> && cd <dir>
npm install --save-dev @codahq/packs-sdk@latest
```

### Register an API token (once per directory)

```bash
npx packs register
```

Run without a token and it opens your account page to create a **Pack-scoped** API token, then prompts
you to paste it in. (Non-interactively, or for a single-tenant/custom-domain account, pass
`--apiToken <token>` and, if your org uses a custom domain, `--codaApiEndpoint https://your-org.coda.io`.)

```bash
npx packs whoami
```

Confirms the token by printing your name and email. Because registration is per-directory, repeat
`register` (with the same token) in every new directory you create.

## Steps

### 1. Write `pack.ts`

`npx packs init` scaffolds an empty `pack.ts`. Fill in `setInstructions` (required) and `setTools`
(everything left out of `setTools` is off). Ask what the agent should actually do and which
tools/connectors it needs before writing this — don't guess a persona or connector IDs.

### 2. Build (local, no token needed)

```bash
npx packs build pack.ts
```

Only bundles the TypeScript — does not execute `pack.ts`. A too-old SDK is **not** caught here.

### 3. Validate (local, no token needed)

```bash
npx packs validate pack.ts
```

This is the first command that actually imports `pack.ts`, so a too-old SDK surfaces here as
`sdk.newAgent is not a function` (fix: `npm install @codahq/packs-sdk@latest`). Exit code 0 with no
output means it passed. Always run this after any edit, before uploading.

### 4. Create the pack (once per pack)

```bash
npx packs create pack.ts --name "<name>" --description "<description>"
```

Mints a new pack ID and stores it in `.coda-pack.json` for this directory. Run this **once per pack** —
running it again in the same directory overwrites that mapping (the old pack keeps running, you just
lose its local tracking file). See "Two packs, or a second install" below if you want a second,
independent pack.

The pack's page won't show your source yet at this point — that's expected, upload (step 5) hasn't
happened.

### 5. Upload a version (writes the agent definition)

```bash
npx packs upload pack.ts --notes "<what changed>"
```

Every upload **creates a new version** (1, 2, 3, ... auto-assigned) — it never overwrites a prior
version. Because the pack declares an agent, upload is what actually writes/updates the agent
definition. Re-run this after every `pack.ts` edit (new tools, new instructions, new trigger, etc.) —
there is no separate "save" step.

### 6. Set the listing name/description (UI)

Open `https://coda.io/p/<packId>?section=listing` to set/confirm the agent's name and description —
these are listing fields, not part of `pack.ts`.

### 7. Install and run (UI)

Open the agent directory (https://go.superhuman.com/agent-directory), search for the agent by the name
set in step 4/6, click **Open** → **install agent**. An uploaded-but-unreleased agent still runs for the
installer; a release (step 8) is only needed to make it broadly installable.

### 8. (Optional) Release — make a version broadly installable

```bash
npx packs release pack.ts <version> --notes "<release notes>"
```

Needs `--notes` and a version greater than the latest release, plus a clean working tree if the pack
directory is a git repo.

## Two packs, or a second install

**Triggers and tool grants are copied at install time — they don't live-sync from later uploads.** If
you already installed an agent, then upload a new version that changes `setDefaultScheduleTrigger` (or
tools), the already-installed instance's builder view won't reflect the change. To actually see a new
trigger/tool definition rendered in the builder, either:

- Create a **fresh pack in a new directory** (`cp pack.ts` into it, `npm install`, `register`,
  `create` with a new name, `upload`) and install *that*, so the very first install already carries the
  new definition, or
- Reinstall the existing agent after the new upload (if your product surface supports refreshing an
  install).

The new-directory route is simpler and is what this skill defaults to when verifying a trigger/tool
change actually shows up in the builder UI.

## Testing recurrence rules

If you're testing a `setDefaultScheduleTrigger` rrule string, note that some RFC 5545 rule parts a
schedule trigger accepts — `BYSETPOS` (pick the Nth match from a `BYDAY` set), `WKST` (custom week
start), `COUNT` (bounded occurrences instead of `UNTIL`), ordinal `BYDAY` like `-1FR` ("last Friday") —
may not have a corresponding field in a simple recurrence-picker UI. Example:
`RRULE:FREQ=MONTHLY;BYDAY=-1FR;BYSETPOS=-1;BYMONTH=3;WKST=SU;COUNT=10`. Frequencies below hourly
(`MINUTELY`, `SECONDLY`) are rejected outright rather than being a "valid but unrepresentable" case —
see `references/api.md` for the full set of accepted/rejected rule parts.
