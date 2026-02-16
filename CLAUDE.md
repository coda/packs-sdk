# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in the Packs SDK repository.

## Common Development Commands

### Setup

```bash
make bootstrap   # (alias: make bs) Install pnpm, Node deps, Python/pipenv, doc tools, git hooks
source setup-env.sh  # REQUIRED before running any commands
```

**Important**: Use a clean terminal -- this environment is isolated from the `coda` repo.

### Compile

```bash
make compile        # Full: isolated-vm binaries + TypeScript + thunk bundle + docs scripts + dts-bundle + dist artifacts
make compile-ts     # TypeScript + thunk bundle + esbuild bundle.js + dist artifacts (skip isolated-vm rebuild)
make compile-thunk  # esbuild thunk bundle only (bundles/thunk_bundle.js)
```

### Test

```bash
make test                          # Run all tests (test/*_test.ts)
make test-file FILE=test/foo_test.ts  # Run a single test file
```

### Lint and Format

```bash
make lint            # Full: ESLint + markdown lint (remark + cspell) + changelog lint (kacl)
make lint-code       # ESLint only (fastest)
make lint-fix        # ESLint with --fix
make autoformat-ts   # Prettier --write on all .ts/.tsx
make autoformat-all-no-fix  # Prettier --check (fails if any file would change)
```

### Docs

```bash
make docs       # Full build: typedoc + generated docs + JS bundle + MkDocs
make view-docs  # Local preview server on localhost:8000
make typedoc    # API reference only (docs/reference/sdk/)
```

### Build and Publish

```bash
make build          # clean + lint + compile + docs
make publish-local  # Full build, then copy dist/* into ../packs/node_modules/@codahq/packs-sdk/dist/
```

## Repository Structure

```
index.ts              # Main SDK exports (for pack authors)
development.ts        # Testing/development exports (mocks, execution helpers)
builder.ts            # newPack(), PackDefinitionBuilder
schema.ts             # Schema types and helpers (makeObjectSchema, etc.)
types.ts              # Pack definition types, auth types
api.ts, api_types.d.ts # Formula/parameter types, ExecutionContext
compiled_types.ts     # Compiled pack metadata types (used by browser/runtime)
cli/                  # CLI commands (coda validate, coda upload, etc.)
helpers/              # Shared utilities (URL, schema, metadata, marshaling)
runtime/              # Pack execution runtime (thunk, bootstrap, marshaling for isolated-vm)
testing/              # Test utilities exported to pack authors (mocks, execution, compile, validation)
test/                 # Internal test files (*_test.ts)
bundles/              # Pre-built thunk bundle (thunk_bundle.js) -- committed to repo
dev/                  # ESLint plugin with custom Coda rules
documentation/        # Samples, scripts, theme for docs site
docs/                 # MkDocs content (reference docs are auto-generated)
```

## Architecture Overview

The Coda Packs SDK (`@codahq/packs-sdk`) lets developers build Packs -- extensions that add formulas, sync tables, column formats, and AI skills to Coda documents.

### Entry Points

- `index.ts` -- public API for pack authors (`newPack`, `makeFormula`, `makeSyncTable`, `makeObjectSchema`, etc.)
- `development.ts` -- testing/dev utilities (`newMockExecutionContext`, `executeFormulaFromPackDef`, `compilePackBundle`)

### Builder Pattern

`newPack()` returns a `PackDefinitionBuilder` with methods like `addFormula()`, `addSyncTable()`, `setUserAuthentication()`, `addSkill()`, `setChatSkill()`. This is the primary API for defining packs.

### Bundle System

- **Pack bundles**: Browserify via `testing/compile.ts` bundles pack source into a single CommonJS module
- **Thunk bundle**: esbuild bundles `runtime/thunk/thunk.ts` into `bundles/thunk_bundle.js` (IIFE format, loaded into isolated-vm)
- **SDK bundle**: esbuild bundles `index.ts` into `dist/bundle.js` (used by Pack Studio in browser)

### Validation

Zod schemas in `testing/upload_validation.ts` validate pack metadata. The same validation runs:
- Locally via `coda validate <manifest>`
- On Coda's server during pack upload

### Runtime

Packs execute in an `isolated-vm` sandbox. The `runtime/` directory contains the thunk (entry point loaded into the sandbox), bootstrap code, and marshaling utilities for passing data across the sandbox boundary.

### CLI

Yargs-based `coda` command in `cli/coda.ts`. Key subcommands: `validate`, `upload`, `execute`, `build`, `auth`, `init`, `clone`, `release`.

## Testing

### Framework

Mocha + Chai + Sinon. Config in `.mocharc.json` (20s timeout, check-leaks enabled).

### Running Tests

```bash
make test                              # All tests
make test-file FILE=test/schema_test.ts  # Single file
```

### Globals

`assert` and `expect` are available globally via `test/bootstrap.ts` (no import needed).

### Test Helpers

- `test/test_helper.ts` -- `willBeRejected(promise)`, `willBeRejectedWith(promise, matcher)`
- `test/test_utils.ts` -- `createFakePack()`, `createFakePackVersionMetadata()`, `createFakePackFormulaMetadata()`
- `testing/mocks.ts` -- `newMockExecutionContext()`, `newMockSyncExecutionContext()`, `newJsonFetchResponse()`

### Sinon

Call `sinon.restore()` in `afterEach`. There is no auto-restore setup like in coda4.

## Code Style

### ESLint

Flat config in `eslint.config.mjs` with TypeScript-ESLint and a custom `coda` plugin (`dev/eslint/eslint-plugin-coda-rules/`).

Key rules:
- **File naming**: `snake_case.ts` (enforced by `check-file` plugin)
- **Max line length**: 120 characters
- **Imports**: split imports from the same module into separate statements (`coda/coda-import-style` rule)
- **No console.log**: banned outside of tests
- **Banned APIs**: `Promise.race`, `it.only`, `describe.only`

### Formatting

Prettier runs automatically on commit via `lint-staged` (covers `*.{css,json,ts}`).

### Sample Code Style

Files in `documentation/samples/` have different rules: double quotes, 80 char limit, `object-shorthand: never`, `func-style: declaration`. This matches the public-facing documentation style.

## CI Checks and Pre-Push Checklist

CI runs on every PR and push to main via GitHub Actions (`.github/workflows/ci.yml`). All 5 checks must pass.

### CI Job to Local Command Mapping

| CI Job | Local Command | What It Checks |
|--------|--------------|----------------|
| test | `make test` | Mocha on all `test/*_test.ts` |
| lint | `make lint` | ESLint + markdown lint (remark + cspell) + changelog lint (kacl) |
| check-formatting | `make autoformat-all-no-fix` | Prettier check -- fails if any file would be reformatted |
| validate-samples | `make validate-samples` | `coda validate` on every `.ts` in `documentation/samples/packs/` |
| validate-no-changes | `make validate-no-changes` | `clean` + `compile` + `docs`, then verifies zero uncommitted changes |

### Pre-Push Checklist

```bash
make test                    # Run all tests
make lint                    # Lint code + markdown + changelog
make autoformat-all-no-fix   # Check formatting
make validate-samples        # Validate sample packs
make compile                 # Rebuild dist/ and bundles/
# Then: git add any changed dist/ files and commit them
```

Or use `make build` + `make test` to cover everything:

```bash
make build    # clean + lint + compile + docs
make test     # tests are not included in build
```

### The `dist/` Commitment Requirement

Unlike most repos, compiled output in `dist/` and `bundles/` MUST be committed. After any source change, run `make compile` (or `make build`) and commit the resulting changes. The `validate-no-changes` CI job will fail if compiled output is stale.

### Troubleshooting `validate-no-changes`

This is the most common CI-only failure. CI runs `make compile` (which includes `dts-bundle-generator`) on a clean checkout, then fails if any file differs from what's committed.

**Quick local check for dist drift:**

```bash
make compile-ts          # Rebuild dist/ from TypeScript source
git diff --stat dist/    # See if anything changed vs. committed
# If files changed → commit them
```

**Why `make compile-ts` instead of `make compile`?** The full `make compile` includes `dts-bundle-generator`, which may fail locally with `@types/eslint-scope` type conflicts that don't occur in CI. `make compile-ts` covers the core TypeScript compilation and is sufficient to verify `dist/` output.

**Common causes:**

- Source comments propagate to compiled JS — even "just comments" in files under `testing/` require a dist rebuild
- Any change to `testing/upload_validation.ts` needs a matching update to `dist/testing/upload_validation.js`
- Thunk changes need `bundles/thunk_bundle.js` and `dist/bundles/thunk_bundle.js` updated

### Git Hooks

`lint-staged` runs Prettier on `*.{css,json,ts}` files automatically on every commit. Installed by `make bootstrap`.

### Docs Deploy

Merges to main trigger docs builds and deploys to head, then staging, then prod via AWS S3. These are not blocking for PRs.

## Publishing and Release

- **Local testing**: `make publish-local` runs a full build then copies `dist/*` into `../packs/node_modules/@codahq/packs-sdk/dist/`
- **NPM release**: `make release` (from main, no uncommitted changes, no unpushed commits). Uses `release-it`.
- **Manual/prerelease**: `make release-manual` (from a non-main branch)
- **Changelog**: follows Keep a Changelog format. Unreleased items go under `## Unreleased` at the top of `CHANGELOG.md`.

## Important Notes

- Node >=22, pnpm 10.28.2 (enforced by `engines` in `package.json`)
- `source setup-env.sh` required before any commands
- `dist/` and `bundles/` must be committed -- CI enforces this
- Reference docs (`docs/reference/sdk/`) are auto-generated from TypeScript JSDoc -- edit the TS source, not the markdown, then run `make docs`
- `isolated-vm` is an optional dependency for sandbox execution in tests
- This repo has NO npm scripts -- all commands go through the Makefile
