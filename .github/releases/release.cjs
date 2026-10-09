const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {execFileSync, spawnSync} = require('node:child_process');
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
function outputs(values, env) {
  for (const [key, value] of Object.entries(values)) {
    assert.match(String(value), /^[a-zA-Z0-9./_-]+$/, 'unsafe workflow output');
    const line = `${key}=${value}`;
    console.log(line);
    if (env.GITHUB_OUTPUT) fs.appendFileSync(env.GITHUB_OUTPUT, `${line}\n`);
  }
}
function ensureCommit(sha, pr) {
  assert.match(sha, /^[a-f0-9]{40}$/, 'invalid commit SHA');
  try {
    git('cat-file', '-e', `${sha}^{commit}`);
  } catch {
    git('fetch', 'origin', `refs/pull/${pr}/head`);
    git('cat-file', '-e', `${sha}^{commit}`);
  }
}
function tagCommit(version) {
  const tag = `refs/tags/v${version}`;
  const rows = git('ls-remote', 'origin', tag, `${tag}^{}`)
    .split('\n')
    .filter(Boolean)
    .map(line => line.split(/\s+/));
  if (!rows.length) return null;
  for (const [sha, ref] of rows) {
    assert.match(sha, /^[a-f0-9]{40}$/, 'invalid tag SHA');
    assert([tag, `${tag}^{}`].includes(ref), 'unexpected tag ref');
  }
  return (rows.find(row => row[1] === `${tag}^{}`) || rows.find(row => row[1] === tag))[0];
}
function preparedCandidate(pr, env) {
  assert(pr?.merged === true, 'release PR must be merged');
  assert.equal(pr.base?.repo?.full_name, REPOSITORY, 'foreign base repository');
  assert.equal(pr.head?.repo?.full_name, REPOSITORY, 'foreign head repository');
  assert.equal(pr.base.ref, 'main', 'release PR must target main');
  assert.equal(pr.commits, 1, 'release PR must contain one commit');
  assert.match(String(pr.number), /^[1-9]\d*$/, 'invalid release PR number');
  const version = stableVersion(pr.head.ref?.replace(/^release\/v/, ''));
  assert.equal(pr.head.ref, `release/v${version}`, 'invalid release branch');
  const markers = pr.body?.match(/<!-- packs-sdk-release[^]*?-->/g) || [];
  assert.equal(markers.length, 1, 'one prepare marker is required');
  const parsed = markers[0].match(
    /^<!-- packs-sdk-release version=([0-9.]+) source=([a-f0-9]{40}) sync-confirmed=true -->$/,
  );
  assert(parsed, 'invalid prepare marker or sync attestation');
  assert.equal(parsed[1], version, 'marker version mismatch');
  const source = parsed[2],
    sha = pr.merge_commit_sha;
  assert.equal(sha, env.GITHUB_SHA, 'workflow/merge SHA mismatch');
  assert(['refs/heads/main', `refs/tags/v${version}`].includes(env.GITHUB_REF), 'workflow ref mismatch');
  const commits = api(`pulls/${pr.number}/commits`, true).flat();
  assert.equal(commits.length, 1, 'stored release history must contain one commit');
  assert.equal(commits[0].sha, pr.head.sha, 'stored PR head mismatch');
  ensureCommit(pr.head.sha, pr.number);
  ensureCommit(source, pr.number);
  assert.equal(git('rev-parse', `${pr.head.sha}^`), source, 'prepared source parent mismatch');
  const parents = git('show', '-s', '--format=%P', sha).split(' ');
  assert.equal(parents[0], source, 'stale prepared source at merge; maintainer recovery required');
  assert(parents.length === 1 || (parents.length === 2 && parents[1] === pr.head.sha), 'unexpected merge parents');
  assert.equal(
    git('rev-parse', `${pr.head.sha}^{tree}`),
    git('rev-parse', `${sha}^{tree}`),
    'prepared/merged tree mismatch',
  );
  const pkg = sourceJson(sha, 'package.json');
  assert.equal(pkg.name, '@codahq/packs-sdk', 'wrong package identity');
  assert.equal(pkg.version, version, 'package/branch version mismatch');
  const sourceVersion = sourceJson(source, 'package.json').version;
  assert(greater(version, sourceVersion), 'release version must increase from source snapshot');
  const notes = validateCandidate(source, version, sha).notes;
  if (env.GITHUB_REF.startsWith('refs/tags/')) assert.equal(tagCommit(version), sha, 'retry tag identity mismatch');
  return {version, sha, source, sourceVersion, pr: String(pr.number), notes};
}
function reviewedSnapshot(pr, env) {
  if (pr.head?.ref !== 'copybara/packs-sdk-snapshot') return false;
  assert.equal(pr.head.repo?.full_name, REPOSITORY, 'foreign snapshot repository');
  assert.equal(pr.base?.repo?.full_name, REPOSITORY, 'foreign snapshot base');
  assert.equal(pr.base.ref, 'main', 'snapshot must target main');
  assert.equal(pr.commits, 1, 'snapshot needs one exported commit');
  const commits = api(`pulls/${pr.number}/commits`, true).flat();
  assert.equal(commits.length, 1, 'snapshot stored history needs one exported commit');
  assert.equal(commits[0].sha, pr.head.sha, 'snapshot stored head mismatch');
  ensureCommit(commits[0].sha, pr.number);
  const footers = git('show', '-s', '--format=%B', commits[0].sha).match(/^GitOrigin-RevId: [a-f0-9]{40}$/gm) || [];
  assert.equal(footers.length, 1, 'snapshot exported origin footer missing or invalid');
  assert.equal(
    git('diff', '--name-only', `${env.GITHUB_SHA}^`, env.GITHUB_SHA, '--', '.github'),
    '',
    'snapshot changed public-owned automation',
  );
  assert.equal(
    git('diff', '--name-only', pr.head.sha, env.GITHUB_SHA, '--', '.', ':!.github'),
    '',
    'snapshot merge differs from exported source',
  );
  const pkg = sourceJson(env.GITHUB_SHA, 'package.json');
  assert.equal(pkg.name, '@codahq/packs-sdk', 'snapshot package identity mismatch');
  stableVersion(pkg.version);
  return true;
}
function resolveCandidate(env) {
  assert.equal(env.GITHUB_REPOSITORY, REPOSITORY, 'untrusted repository');
  assert.equal(git('rev-parse', 'HEAD'), env.GITHUB_SHA, 'workflow SHA mismatch');
  if (env.GITHUB_EVENT_NAME === 'workflow_dispatch') {
    assert.match(env.RELEASE_PR || '', /^[1-9]\d*$/, 'positive numeric release PR required');
    assert(Number.isSafeInteger(Number(env.RELEASE_PR)), 'unsafe release PR number');
    return preparedCandidate(api(`pulls/${env.RELEASE_PR}`), env);
  }
  assert.equal(env.GITHUB_EVENT_NAME, 'push', 'unsupported release event');
  assert.equal(env.GITHUB_REF, 'refs/heads/main', 'push requires main');
  const pkg = sourceJson(env.GITHUB_SHA, 'package.json');
  const old = sourceJson(`${env.GITHUB_SHA}^`, 'package.json');
  if (pkg.version === old.version) return null;
  const prs = api(`commits/${env.GITHUB_SHA}/pulls`, true)
    .flat()
    .filter(pr => typeof pr.merged_at === 'string' && pr.merge_commit_sha === env.GITHUB_SHA);
  assert.equal(prs.length, 1, 'version change requires exactly one merged prepared release PR');
  assert.match(String(prs[0].number), /^[1-9]\d*$/, 'invalid associated PR number');
  const pr = api(`pulls/${prs[0].number}`);
  assert(pr.merged === true && pr.merge_commit_sha === env.GITHUB_SHA, 'associated PR merge identity changed');
  if (reviewedSnapshot(pr, env)) return null;
  return preparedCandidate(pr, env);
}
async function registryState(candidate) {
  const exact = await httpJson(`https://registry.npmjs.org/@codahq%2fpacks-sdk/${candidate.version}`, true);
  const latest = await httpJson('https://registry.npmjs.org/@codahq%2fpacks-sdk/latest');
  stableVersion(latest.version);
  if (exact) {
    assert.equal(exact.name, '@codahq/packs-sdk', 'registry package identity mismatch');
    assert.equal(exact.version, candidate.version, 'registry version mismatch');
    assert.match(
      exact.dist?.integrity || '',
      /^sha512-[A-Za-z0-9+/]+={0,2}$/,
      'registry integrity is missing or invalid',
    );
  } else assert(greater(candidate.version, latest.version), 'new publication must exceed npm latest');
  return {exact, latest};
}
async function preflight(candidate) {
  assert(
    !openPullRequests().some(pr => pr.head.ref === 'copybara/packs-sdk-snapshot'),
    'open snapshot blocks publication',
  );
  const tag = tagCommit(candidate.version);
  assert(!tag || tag === candidate.sha, 'conflicting remote release tag');
  return registryState(candidate);
}
async function inspect(env) {
  const candidate = resolveCandidate(env);
  if (!candidate) return outputs({eligible: 'false'}, env);
  await preflight(candidate);
  if (env.PACKS_SDK_PUBLISH_ENABLED === 'true' && (env.GITHUB_EVENT_NAME === 'push' || env.RELEASE_DRY_RUN === 'false'))
    protectedEnvironment();
  else
    summary(
      'Publication is disabled or this is a dry run. Maintainers must verify sdk-release protection and npm trust before activation.',
      env,
    );
  summary(
    `Candidate PR #${candidate.pr}: ${candidate.version}\nMerge: ${candidate.sha}\nSource snapshot: ${candidate.source}\nSync attestation: true`,
    env,
  );
  outputs({eligible: 'true', sha: candidate.sha, version: candidate.version, pr: candidate.pr}, env);
}
function packArchive(sha) {
  assert.match(sha, /^[a-f0-9]{40}$/, 'invalid package SHA');
  assert.equal(command('npm', ['--version']), '11.15.0', 'pinned npm 11.15.0 is required');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sdk-release-pack-'));
  try {
    const archive = path.join(directory, 'source.tar'),
      source = path.join(directory, 'source'),
      output = path.join(directory, 'output');
    fs.mkdirSync(source);
    fs.mkdirSync(output);
    command('git', ['archive', '--format=tar', `--output=${archive}`, sha]);
    command('tar', ['-xf', archive, '-C', source]);
    const pkg = JSON.parse(fs.readFileSync(path.join(source, 'package.json'), 'utf8'));
    assert.equal(pkg.name, '@codahq/packs-sdk', 'wrong packed package identity');
    stableVersion(pkg.version);
    const records = JSON.parse(
      command('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', output], {cwd: source}),
    );
    assert.equal(records.length, 1, 'expected one packed package');
    const record = records[0];
    assert.equal(record.name, pkg.name, 'packed package name mismatch');
    assert.equal(record.version, pkg.version, 'packed package version mismatch');
    assert.equal(path.basename(record.filename), record.filename, 'unsafe tarball filename');
    const committed = new Set(git('ls-tree', '-r', '--name-only', sha).split('\n'));
    const files = new Set(record.files.map(file => file.path));
    for (const file of files) assert(committed.has(file), `packed file is not a committed input: ${file}`);
    const expected = [
      'package.json',
      pkg.main,
      pkg.typings || pkg.types,
      ...Object.values(pkg.bin || {}),
      'dist/bundle.js',
      'dist/bundle.d.ts',
      'dist/buffer.d.ts',
      'dist/bundles/thunk_bundle.js',
    ];
    for (const file of expected)
      assert(typeof file === 'string' && files.has(file), `missing package entry/runtime file: ${file}`);
    const packedPath = path.join(output, record.filename);
    const integrity = `sha512-${createHash('sha512').update(fs.readFileSync(packedPath)).digest('base64')}`;
    assert.equal(record.integrity, integrity, 'packed-byte integrity mismatch');
    return {
      path: packedPath,
      integrity,
      version: pkg.version,
      cleanup: () => fs.rmSync(directory, {recursive: true, force: true}),
    };
  } catch (error) {
    fs.rmSync(directory, {recursive: true, force: true});
    throw error;
  }
}
async function checkPackage(env) {
  const sha = env.RELEASE_SHA || git('rev-parse', 'HEAD');
  assert.equal(git('rev-parse', 'HEAD'), sha, 'validated/package SHA mismatch');
  const packed = packArchive(sha);
  try {
    const existing = await httpJson(`https://registry.npmjs.org/@codahq%2fpacks-sdk/${packed.version}`, true);
    if (existing) {
      assert.equal(existing.name, '@codahq/packs-sdk', 'registry package identity mismatch');
      assert.equal(existing.version, packed.version, 'registry version mismatch');
      assert.equal(existing.dist?.integrity, packed.integrity, 'registry integrity mismatch');
    }
    summary(`Validated package ${packed.version} at ${sha}: ${packed.integrity}`, env);
  } finally {
    packed.cleanup();
  }
}
function optionalApi(endpoint) {
  const result = spawnSync('gh', ['api', '--include', `repos/${REPOSITORY}/${endpoint}`], {encoding: 'utf8'});
  const status = result.stdout?.match(/^HTTP\/[0-9.]+ (\d{3})[^\n]*\r?\n/);
  assert(status, 'GitHub API status is unavailable');
  if (status[1] === '404') return null;
  assert(result.status === 0 && status[1] === '200', `GitHub API request failed (${status[1]})`);
  const body = result.stdout
    .split(/\r?\n\r?\n/)
    .slice(1)
    .join('\n\n');
  return JSON.parse(body);
}
function githubState(candidate) {
  // The by-tag endpoint omits drafts; authenticated listings include them.
  const pages = api('releases?per_page=100', true);
  assert(Array.isArray(pages) && pages.every(Array.isArray), 'invalid GitHub releases response');
  const releases = pages.flat().filter(release => release?.tag_name === `v${candidate.version}`);
  assert(releases.length <= 1, 'multiple GitHub releases for the candidate tag');
  const release = releases[0];
  const latest = optionalApi('releases/latest');
  if (latest) stableVersion(latest.tag_name?.replace(/^v/, ''));
  if (release) {
    assert.equal(release.tag_name, `v${candidate.version}`, 'GitHub release tag mismatch');
    assert.equal(release.name, `v${candidate.version}`, 'conflicting GitHub release title');
    assert.equal(release.body?.trim(), candidate.notes, 'conflicting GitHub release notes');
    assert.equal(typeof release.draft, 'boolean', 'invalid GitHub draft state');
    assert.equal(release.prerelease, false, 'conflicting GitHub prerelease state');
    assert.equal(tagCommit(candidate.version), candidate.sha, 'GitHub release requires the reviewed remote tag');
  } else assert(latest?.tag_name !== `v${candidate.version}`, 'GitHub release API state is inconsistent');
  return {release, latest};
}
function newerReleaseExists(candidate, registry, github) {
  return (
    greater(registry.latest.version, candidate.version) ||
    (github.latest && greater(github.latest.tag_name.replace(/^v/, ''), candidate.version))
  );
}
function rejectNpmTokens(env) {
  assert(
    !Object.entries(env).some(([key, value]) => /^npm_config_.*(?:auth|password)/i.test(key) && value),
    'npm authentication environment is forbidden',
  );
  assert(
    !env.NPM_TOKEN && !env.NODE_AUTH_TOKEN && !env.NPM_CONFIG__AUTH && !env.npm_config__auth,
    'npm tokens are forbidden; use workflow OIDC',
  );
  const files = [
    path.join(process.cwd(), '.npmrc'),
    env.NPM_CONFIG_USERCONFIG || env.npm_config_userconfig || path.join(os.homedir(), '.npmrc'),
  ];
  for (const file of files) {
    if (fs.existsSync(file))
      assert(
        !/(?:_authToken|_auth|password)\s*=/i.test(fs.readFileSync(file, 'utf8')),
        'npm authentication config is forbidden; use workflow OIDC',
      );
  }
  assert(env.ACTIONS_ID_TOKEN_REQUEST_URL && env.ACTIONS_ID_TOKEN_REQUEST_TOKEN, 'GitHub OIDC identity is unavailable');
}
async function publish(env) {
  assert.equal(env.PACKS_SDK_PUBLISH_ENABLED, 'true', 'publication is disabled');
  assert.equal(env.RELEASE_DRY_RUN, 'false', 'publication requires an explicit live run');
  rejectNpmTokens(env);
  const candidate = resolveCandidate(env);
  assert(candidate, 'publication requires a prepared release PR');
  assert.equal(candidate.sha, env.RELEASE_SHA, 'validated/publish SHA mismatch');
  assert.equal(candidate.version, env.RELEASE_VERSION, 'validated/publish version mismatch');
  assert.equal(git('rev-parse', 'HEAD'), candidate.sha, 'publish checkout SHA mismatch');
  assert.equal(git('status', '--porcelain'), '', 'publish checkout must be clean');
  exportedTools(sourceJson(candidate.sha, 'package.json'));
  protectedEnvironment();
  let packed,
    output = '';
  const stageId = () =>
    output.match(
      /^📦 Staged, not yet published\. Approve at \S+ \(or `npm stage approve ([0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})`\)\.$/im,
    )?.[1];
  try {
    await preflight(candidate);
    githubState(candidate);
    const localTag = spawnSync('git', ['show-ref', '--verify', '--quiet', `refs/tags/v${candidate.version}`]);
    assert([0, 1].includes(localTag.status), 'local release tag lookup failed');
    if (localTag.status === 0)
      assert.equal(
        git('rev-parse', `refs/tags/v${candidate.version}^{commit}`),
        candidate.sha,
        'conflicting local release tag',
      );
    packed = packArchive(candidate.sha);
    assert.equal(packed.version, candidate.version, 'packed candidate version mismatch');
    const registry = await registryState(candidate);
    const github = githubState(candidate);
    if (registry.exact)
      assert.equal(registry.exact.dist.integrity, packed.integrity, 'existing npm integrity mismatch');
    const existingTag = tagCommit(candidate.version);
    assert(!existingTag || existingTag === candidate.sha, 'conflicting remote release tag');
    const skipNpm = Boolean(registry.exact) || env.RELEASE_SKIP_NPM === 'true';
    const args = [
      'exec',
      'release-it',
      '--ci',
      '--no-increment',
      '--quiet',
      '--config',
      '.github/releases/publish.config.cjs',
      '--npm.publishPath',
      packed.path,
    ];
    if (skipNpm) args.push('--no-npm.publish');
    if (existingTag) args.push('--no-git.tag');
    if (github.release) args.push('--no-github.release');
    if (newerReleaseExists(candidate, registry, github)) args.push('--github.makeLatest=false');
    output = command(PNPM, args, {
      env: {
        ...env,
        GIT_COMMITTER_NAME: 'github-actions[bot]',
        GIT_COMMITTER_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com',
      },
    });
    console.log(output);
    if (!skipNpm) assert(stageId(), 'npm stage ID is unconfirmed; inspect npm before retrying');
    assert.equal(tagCommit(candidate.version), candidate.sha, 'release tag identity changed');
    const releaseUrl =
      github.release?.html_url || output.match(/^🔗 (https:\/\/github\.com\/coda\/packs-sdk\/releases\/[^\s]+)$/m)?.[1];
    assert(
      typeof releaseUrl === 'string' && /^https:\/\/github\.com\/coda\/packs-sdk\/releases\/[^\s]+$/.test(releaseUrl),
      'GitHub release URL is unconfirmed; inspect GitHub before retrying',
    );
    const npmStatus = registry.exact
      ? 'npm: matching public package; submission skipped.'
      : skipNpm
        ? 'npm: submission skipped by the operator; inspect the existing stage and approve it if pending.'
        : `npm: pending approval. Stage ID: ${stageId()}. Approve with npm stage approve ${stageId()}.`;
    summary(
      `Release v${candidate.version}: PR #${candidate.pr}; merge ${candidate.sha}; source ${candidate.source}\n` +
        `${packed.integrity}\n${npmStatus}\nGitHub: ${releaseUrl}\n` +
        (github.release?.draft === false
          ? 'GitHub release was already published.\n'
          : 'After npm approval, publish the GitHub draft using this URL.\n') +
        'Complete the documentation deployments and internal dependency update in the release runbook.',
      env,
    );
  } catch (error) {
    if (error.stdout) {
      output = String(error.stdout);
      console.log(output);
    }
    summary(
      `Incomplete release v${candidate.version}: PR #${candidate.pr}; merge ${candidate.sha}; source ${candidate.source}.\n` +
        `Stage ID: ${stageId() || 'unconfirmed'}; packed integrity ${packed?.integrity || 'not packed'}.\n` +
        'Inspect npm and GitHub before retrying. If submission was accepted, select skip-npm to finish the missing steps; keep the version and commit unchanged.',
      env,
    );
    throw error;
  } finally {
    packed?.cleanup();
  }
}
async function main(env = process.env) {
  if (process.argv[2] === 'publish') return publish(env);
  if (process.argv[2] === 'inspect') return inspect(env);
  if (process.argv[2] === 'check-package') return checkPackage(env);
  assert.equal(process.argv[2], 'prepare', 'unknown release command');
  return prepare(env);
}
module.exports = {stableVersion, changelogEntry};
if (require.main === module)
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
