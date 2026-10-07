const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const REPOSITORY = 'coda/packs-sdk';
const PNPM = '.pnpm_install/bin/pnpm';
function command(program, args, options = {}) {
  return execFileSync(program, args, {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...options}).trim();
}
const git = (...args) => command('git', args);
function stableVersion(value) {
  assert.equal(typeof value, 'string', 'exact stable version is required');
  assert.match(value, /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/, 'exact stable version is required');
  assert(
    value.split('.').every(part => Number.isSafeInteger(Number(part))),
    'stable version components must be safe integers',
  );
  return value;
}
function greater(a, b) {
  stableVersion(a);
  stableVersion(b);
  const x = a.split('.').map(Number),
    y = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i];
  return false;
}
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sourceJson = (sha, file) => JSON.parse(git('show', `${sha}:${file}`));
function exportedTools(pkg) {
  assert.equal(pkg.name, '@codahq/packs-sdk', 'wrong package identity');
  assert.equal(pkg.devDependencies?.['release-it'], '21.1.0', 'reviewed release-it export required');
  assert.equal(
    pkg.devDependencies?.['@release-it/keep-a-changelog'],
    '8.0.1',
    'reviewed changelog plugin export required',
  );
  for (const file of ['package-lock.json', 'npm-shrinkwrap.json'])
    assert(!fs.existsSync(file), `unexpected npm lockfile: ${file}`);
}
async function httpJson(url, absentAllowed = false) {
  const response = await fetch(url, {signal: AbortSignal.timeout(15000)});
  if (absentAllowed && response.status === 404) return null;
  assert(response.ok, `HTTP ${response.status} reading ${url}`);
  const result = await response.json();
  assert(result && typeof result === 'object', `invalid JSON schema from ${url}`);
  return result;
}
async function checkLive(sourceVersion) {
  const live = await httpJson('https://coda.io/versionz');
  stableVersion(live.packsSdkVersion);
  assert(
    !greater(sourceVersion, live.packsSdkVersion),
    `source snapshot ${sourceVersion} is not live (${live.packsSdkVersion})`,
  );
}
function api(endpoint, paginated = false) {
  return JSON.parse(
    command('gh', ['api', ...(paginated ? ['--paginate', '--slurp'] : []), `repos/${REPOSITORY}/${endpoint}`]),
  );
}
function protectedEnvironment() {
  const environment = api('environments/sdk-release');
  assert(Array.isArray(environment?.protection_rules), 'invalid sdk-release protection rules');
  const rules = environment.protection_rules.filter(rule => rule?.type === 'required_reviewers');
  assert.equal(rules.length, 1, 'sdk-release requires one reviewer rule');
  const rule = rules[0];
  assert.equal(rule.prevent_self_review, true, 'sdk-release must prevent self-review');
  assert.equal(environment.can_admins_bypass, false, 'sdk-release must disallow admin bypass');
  assert(Array.isArray(rule.reviewers), 'invalid sdk-release reviewer response');
  assert.equal(rule.reviewers.length, 1, 'sdk-release must require only @coda/go-ecosystem');
  const reviewer = rule.reviewers[0];
  assert.equal(reviewer?.type, 'Team', 'sdk-release must require @coda/go-ecosystem');
  assert.equal(reviewer.reviewer?.id, 16002834, 'sdk-release must require @coda/go-ecosystem');
  assert.equal(reviewer.reviewer?.slug, 'go-ecosystem', 'sdk-release team identity changed');
  assert.equal(
    environment.deployment_branch_policy?.custom_branch_policies,
    true,
    'sdk-release needs explicit main/tag policies',
  );
  assert.equal(
    environment.deployment_branch_policy?.protected_branches,
    false,
    'sdk-release needs explicit main/tag policies',
  );
  const pages = api('environments/sdk-release/deployment-branch-policies', true);
  assert(Array.isArray(pages), 'invalid sdk-release policy response');
  const policies = pages.flat().flatMap(page => {
    assert(page && Array.isArray(page.branch_policies), 'invalid sdk-release policy page');
    return page.branch_policies;
  });
  assert(
    policies.every(
      policy =>
        (policy?.name === 'main' && policy.type === 'branch') || (policy?.name === 'v*' && policy.type === 'tag'),
    ),
    'sdk-release has unexpected ref policies',
  );
  assert(
    policies.some(policy => policy.name === 'main' && policy.type === 'branch') &&
      policies.some(policy => policy.name === 'v*' && policy.type === 'tag'),
    'sdk-release must allow main and v* tags',
  );
}
function openPullRequests() {
  const pages = JSON.parse(
    command('gh', ['api', '--paginate', '--slurp', `repos/${REPOSITORY}/pulls?state=open&per_page=100`]),
  );
  assert(Array.isArray(pages), 'invalid open PR response');
  const prs = pages.flat();
  for (const pr of prs) assert(pr && typeof pr.head?.ref === 'string', 'invalid open PR schema');
  return prs;
}
function checkOpenRequests(branch) {
  const prs = openPullRequests();
  assert(!prs.some(pr => pr.head.ref === 'copybara/packs-sdk-snapshot'), 'open snapshot blocks preparation');
  assert(
    !prs.some(pr => pr.head.ref.startsWith('release/v') && pr.head.ref !== branch),
    'different release PR is open',
  );
  return prs.find(pr => pr.head.ref === branch);
}
function changelogEntry(text, version) {
  const escaped = version.replaceAll('.', '\\.');
  const headers = text.match(new RegExp(`^## \\[${escaped}\\] - \\d{4}-\\d{2}-\\d{2}$`, 'gm')) || [];
  assert.equal(headers.length, 1, 'expected exactly one dated release changelog');
  const start = text.indexOf(headers[0]);
  const next = text.indexOf('\n## ', start + headers[0].length);
  const entry = text.slice(start, next < 0 ? undefined : next).trim();
  assert(/^- \S/m.test(entry), 'release changelog is empty');
  return entry;
}
function allowedReleasePath(file) {
  return (
    ['package.json', 'CHANGELOG.md', 'pnpm-lock.yaml', 'bundles/thunk_bundle.js', 'docs/assets/bundle.js'].includes(
      file,
    ) ||
    file.startsWith('dist/') ||
    file.startsWith('docs/reference/sdk/') ||
    file.startsWith('docs/samples/') ||
    file === 'docs/reference/cli/index.md' ||
    [
      'documentation/generated/snippets.json',
      'documentation/generated/pack.code-snippets',
      'documentation/generated/examples.json',
    ].includes(file)
  );
}
function validateCandidate(source, version, ref) {
  const original = sourceJson(source, 'package.json');
  const candidate = ref ? sourceJson(ref, 'package.json') : readJson('package.json');
  assert.equal(candidate.version, version, 'wrong candidate version');
  candidate.version = original.version;
  assert.deepEqual(candidate, original, 'package content changed beyond version');
  const changed = git('diff', '--name-only', source, ...(ref ? [ref] : []), '--')
    .split('\n')
    .filter(Boolean);
  if (!ref) changed.push(...git('ls-files', '--others', '--exclude-standard').split('\n').filter(Boolean));
  assert(changed.includes('package.json') && changed.includes('CHANGELOG.md'), 'missing release changes');
  for (const file of changed) assert(allowedReleasePath(file), `unexpected release path: ${file}`);
  if (changed.includes('pnpm-lock.yaml')) {
    const oldLock = git('show', `${source}:pnpm-lock.yaml`);
    const newLock = ref ? git('show', `${ref}:pnpm-lock.yaml`) : fs.readFileSync('pnpm-lock.yaml', 'utf8').trim();
    // Only a version scalar in the root importer may change. Keep the locked graph byte-identical.
    const normalize = (text, expected) =>
      text.replace(/(^importers:\n  \.:\n(?:    [^\n]*\n)*?)    version: ([^\n]+)\n/m, (match, prefix, value) => {
        assert.equal(value.replace(/^['"]|['"]$/g, ''), expected, 'unexpected lock importer version');
        return prefix;
      });
    assert.equal(normalize(newLock, version), normalize(oldLock, original.version), 'lock dependency graph changed');
  }
  const changelog = ref ? git('show', `${ref}:CHANGELOG.md`) : fs.readFileSync('CHANGELOG.md', 'utf8');
  return {files: [...new Set(changed)], notes: changelogEntry(changelog, version)};
}
function marker(version, source) {
  return `<!-- packs-sdk-release version=${version} source=${source} sync-confirmed=true -->`;
}
function summary(message, env) {
  console.log(message);
  if (env.GITHUB_STEP_SUMMARY) fs.appendFileSync(env.GITHUB_STEP_SUMMARY, `${message}\n`);
}
function assertFreshSource(source) {
  assert.equal(
    git('ls-remote', 'origin', 'refs/heads/main').split(/\s/)[0],
    source,
    'main advanced; close/delete stale preparation and recreate it, do not rebase or force-push',
  );
}
function createPullRequest(branch, version, source, notes, env) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sdk-release-body-'));
  try {
    const body = path.join(directory, 'body.md');
    fs.writeFileSync(
      body,
      `${marker(version, source)}\n\n${notes}\n\n` +
        'Documentation imports, reviewed snapshot and live SDK deployment were confirmed by the dispatcher.\n' +
        'Approve bot-created workflow runs if requested. Review the diff and merge only after CI passes.\n' +
        'Confirm docs staging/prod deployments and the internal dependency update after publication.\n',
    );
    const url = command('gh', [
      'pr',
      'create',
      '--repo',
      REPOSITORY,
      '--base',
      'main',
      '--head',
      branch,
      '--title',
      `packs-sdk: release v${version}`,
      '--body-file',
      body,
    ]);
    summary(
      `Prepared ${url}\nBranch: ${branch}\nCommit: ${git('rev-parse', 'HEAD')}\nSource snapshot: ${source}\n` +
        'Approve bot-created checks if requested and merge only after review/CI. Docs approvals and internal dependency updates remain.',
      env,
    );
  } catch (error) {
    summary(
      `Partial preparation: ${branch} at ${git('rev-parse', 'HEAD')} was pushed; PR creation failed. Retry with the same version and unchanged source.`,
      env,
    );
    throw error;
  } finally {
    fs.rmSync(directory, {recursive: true, force: true});
  }
}
async function resumePrepared({existing, branch, source, version, env}) {
  const remote = git('ls-remote', 'origin', `refs/heads/${branch}`).split(/\s/)[0];
  if (!remote) {
    assert(!existing, 'prepared PR branch is missing');
    return false;
  }
  assert.match(remote, /^[a-f0-9]{40}$/, 'invalid remote branch SHA');
  git('fetch', 'origin', `refs/heads/${branch}`);
  assert.equal(git('rev-parse', `${remote}^`), source, 'stale/conflicting release branch source');
  assert.equal(git('rev-list', '--count', `${source}..${remote}`), '1', 'release branch must contain one commit');
  assert.equal(
    git('show', '-s', '--format=%s', remote),
    `packs-sdk: release v${version}`,
    'conflicting release branch commit',
  );
  const candidate = validateCandidate(source, version, remote);
  if (existing) {
    assert.equal(existing.head.sha, remote, 'prepared PR head changed');
    assert.equal(existing.head.repo?.full_name, REPOSITORY, 'foreign prepared PR');
    assert.equal(existing.base?.repo?.full_name, REPOSITORY, 'foreign prepared PR base');
    assert.equal(existing.base.ref, 'main', 'wrong prepared PR base');
    const markers = existing.body?.match(/<!-- packs-sdk-release[^]*?-->/g) || [];
    assert.deepEqual(markers, [marker(version, source)], 'invalid prepare marker or stale source');
  }
  git('switch', '--detach', remote);
  command('make', ['validate-no-changes']);
  assert.equal(git('status', '--porcelain'), '', 'generated-output mismatch');
  validateCandidate(source, version, git('rev-parse', 'HEAD'));
  assertFreshSource(source);
  const current = checkOpenRequests(branch);
  assert.equal(current?.head.sha, existing?.head.sha, 'prepared PR state changed during retry');
  if (existing)
    summary(`Existing prepared PR: ${existing.html_url}\nCommit: ${remote}\nSource snapshot: ${source}`, env);
  else if (env.RELEASE_DRY_RUN !== 'false')
    summary(`Dry run: existing validated ${branch} at ${remote}; missing PR requires a live retry.`, env);
  else createPullRequest(branch, version, source, candidate.notes, env);
  return true;
}
async function prepare(env) {
  assert.equal(env.SYNC_CONFIRMED, 'true', 'sync confirmation is required');
  const version = stableVersion(env.RELEASE_VERSION);
  assert.equal(env.GITHUB_REPOSITORY, REPOSITORY, 'untrusted repository');
  assert.equal(env.GITHUB_REF, 'refs/heads/main', 'preparation requires main');
  protectedEnvironment();
  assert.equal(git('status', '--porcelain'), '', 'checkout must be clean');
  const source = git('rev-parse', 'HEAD');
  assert.equal(source, env.GITHUB_SHA, 'source SHA mismatch');
  const pkg = readJson('package.json');
  exportedTools(pkg);
  assert(greater(version, pkg.version), 'version must increase from source snapshot');
  const latest = await httpJson('https://registry.npmjs.org/@codahq%2fpacks-sdk/latest');
  assert(greater(version, latest.version), 'version must increase from npm latest');
  assert.equal(
    await httpJson(`https://registry.npmjs.org/@codahq%2fpacks-sdk/${version}`, true),
    null,
    'version already published',
  );
  const branch = `release/v${version}`;
  const existing = checkOpenRequests(branch);
  await checkLive(pkg.version);
  assertFreshSource(source);
  if (await resumePrepared({existing, branch, source, version, env})) return;
  const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
  const unreleased = changelog.split(/^## (?:Unreleased|\[Unreleased\])\s*$/m)[1]?.split(/^## /m)[0];
  assert(unreleased && /^- \S/m.test(unreleased), 'Unreleased changelog is empty');
  git('switch', '-c', branch);
  command(PNPM, ['exec', 'release-it', version, '--ci', '--config', '.github/releases/prepare.config.cjs']);
  command(PNPM, ['install', '--frozen-lockfile']);
  command('make', ['build']);
  command('make', ['test', 'autoformat-all-no-fix', 'validate-samples']);
  const candidate = validateCandidate(source, version);
  if (env.RELEASE_DRY_RUN !== 'false') {
    console.log(git('diff', source));
    summary(`Dry run: ${version} from ${source}; no remote release writes.`, env);
    return;
  }
  git('add', '--', ...candidate.files);
  const identity = {
    ...process.env,
    GIT_AUTHOR_NAME: 'github-actions[bot]',
    GIT_COMMITTER_NAME: 'github-actions[bot]',
    GIT_AUTHOR_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com',
    GIT_COMMITTER_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com',
  };
  command('git', ['commit', '-m', `packs-sdk: release v${version}`], {env: identity});
  command('make', ['validate-no-changes']);
  assert.equal(git('status', '--porcelain'), '', 'generated-output mismatch');
  validateCandidate(source, version, git('rev-parse', 'HEAD'));
  assertFreshSource(source);
  assert(!checkOpenRequests(branch), 'concurrent prepared PR appeared');
  assert.equal(git('ls-remote', 'origin', `refs/heads/${branch}`), '', 'concurrent release branch appeared');
  try {
    git('push', 'origin', `HEAD:refs/heads/${branch}`);
  } catch (error) {
    summary(
      `Branch push failed for ${branch}; inspect remote state before retry. Candidate ${git('rev-parse', 'HEAD')}.`,
      env,
    );
    throw error;
  }
  createPullRequest(branch, version, source, candidate.notes, env);
}
async function main(env = process.env) {
  assert.equal(process.argv[2], 'prepare', 'unknown release command');
  return prepare(env);
}
module.exports = {stableVersion};
if (require.main === module)
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
