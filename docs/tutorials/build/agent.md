---
nav: Agent from the terminal
description: Scaffold, smoke-check, and upload a Superhuman Go agent without leaving your terminal.
icon: octicons/terminal-16
---

# Build an agent from the terminal

If you prefer the terminal over the browser builder, the `packs` CLI covers the agent loop: log in once, scaffold an agent, check it locally, then upload it. Every command below runs with `npx`, so nothing needs a global install.

## Before you start

Node 22 or higher is required. Confirm yours with:

```bash
node --version
```

Log in once from a parent folder (for example `~/agents`): the CLI looks for the API token (`.coda.json`) in the current directory and up through its parents, so one login covers every agent scaffolded underneath it. The pack id (`.coda-pack.json`) stays per project — each agent directory gets its own on `create`.

## 1. Log in

```bash
npx packs login
```

This opens your account page to create a Pack-scoped API token, then prints your identity to confirm the token works. Passing `--apiToken <token>` skips the browser, which is what CI does.

## 2. Scaffold an agent

```bash
mkdir my-helper && cd my-helper
npx packs init --agent --name "my-helper"
```

Unlike the default scaffold, the agent template is vendored in the SDK: it needs neither git nor a network template install. You get a `pack.ts` built on `sdk.newAgent()` with instructions and docs-only tool grants — mail, search, connectors, and the weekly schedule trigger ship commented out for you to enable as needed. Open `pack.ts` and describe what your agent should do — `setInstructions` is the only required call.

## 3. Validate locally

```bash
npx packs validate pack.ts
```

Validate is the first command that imports `pack.ts`, so treat it as the single pre-upload check and the gate before every upload: it covers schema, instructions, and trigger syntax, and — when you're logged in — warns about connector pack IDs that don't resolve. (`build` only bundles without importing — reach for it when debugging packaging issues, not as a gate.) If it reports `sdk.newAgent is not a function`, your SDK copy is older than agent support: reinstall with `npm install @codahq/packs-sdk@latest` and validate again.

## 4. Create and upload

```bash
npx packs create pack.ts --name "my-helper"
npx packs upload pack.ts --notes "First version"
```

`create` runs once per pack and records the id in `.coda-pack.json`. Every upload mints a new version — uploads never overwrite, so re-run `upload` freely after each edit.

`agent chat` returns once the server route ships — until then, verify the live version in the browser: open the agent directory, search the listing name, install the agent, and talk to it there.

## Common pitfalls

- **Reinstall after changing tools or triggers.** Grants copy at install time and do not live-sync from later uploads. After an upload that changes `setTools` or a trigger, reinstall the agent (or scaffold a fresh pack) before judging the change.
- **One directory, one pack.** Running `create` twice in the same directory overwrites the local pack-id mapping; the old pack keeps running but the directory now tracks the new one. Keep each agent in its own directory.
- **Clean tree for releases.** `packs release` needs release notes, a version higher than the last release, and a clean git tree when the directory is a repo.

## Next steps

- [CLI reference](../../reference/cli/index.md) for every flag on `login`, `init --agent`, and `validate`.
- The agent builder API (`setInstructions`, `setTools`, schedule and while-writing triggers) is documented with the SDK reference.
