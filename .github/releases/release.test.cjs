const {test} = require('node:test');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const path = require('node:path');
const cli = path.join(__dirname, 'release.cjs');
test('prepare rejects missing sync confirmation before external operations', () => {
  const result = spawnSync(process.execPath, [cli, 'prepare'], {
    env: {...process.env, RELEASE_VERSION: '1.18.0', GITHUB_REF: 'refs/heads/main', SYNC_CONFIRMED: 'false'},
    encoding: 'utf8',
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /sync confirmation/);
});
const fs = require('node:fs');
const os = require('node:os');
function protection() {
  return {
    can_admins_bypass: false,
    protection_rules: [
      {
        type: 'required_reviewers',
        prevent_self_review: true,
        reviewers: [{type: 'Team', reviewer: {id: 16002834, slug: 'go-ecosystem'}}],
      },
    ],
    deployment_branch_policy: {protected_branches: false, custom_branch_policies: true},
  };
}
function policies() {
  return [
    {
      branch_policies: [
        {name: 'main', type: 'branch'},
        {name: 'v*', type: 'tag'},
      ],
    },
  ];
}
function fixture(t, options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sdk-release-test-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const cwd = path.join(root, 'repo');
  fs.mkdirSync(cwd);
  const git = (...args) => {
    const r = spawnSync('git', args, {cwd, encoding: 'utf8'});
    assert.equal(r.status, 0, r.stderr);
    return r.stdout.trim();
  };
  git('init', '-b', 'main');
  git('config', 'user.name', 'Fixture');
  git('config', 'user.email', 'fixture@example.com');
  fs.writeFileSync(
    path.join(cwd, 'package.json'),
    JSON.stringify({
      name: '@codahq/packs-sdk',
      version: '1.17.6',
      devDependencies: {'release-it': '21.1.0', '@release-it/keep-a-changelog': '8.0.1'},
    }),
  );
  fs.writeFileSync(path.join(cwd, 'CHANGELOG.md'), '# Changelog\n\n## [Unreleased]\n\n### Fixed\n\n- Useful fix.\n');
  fs.mkdirSync(path.join(cwd, 'dist'));
  fs.writeFileSync(path.join(cwd, 'dist', 'index.js'), 'original');
  fs.writeFileSync(path.join(cwd, 'pnpm-lock.yaml'), 'lockfileVersion: 9\n');
  fs.writeFileSync(path.join(cwd, '.gitignore'), '.pnpm_install/\n');
  git('add', '.');
  git('commit', '-m', 'Source');
  const sha = git('rev-parse', 'HEAD');
  const remote = path.join(root, 'remote.git');
  assert.equal(spawnSync('git', ['init', '--bare', remote]).status, 0);
  git('remote', 'add', 'origin', remote);
  git('push', 'origin', 'main');
  const bin = path.join(root, 'bin');
  fs.mkdirSync(bin);
  const log = path.join(root, 'effects');
  const state = path.join(root, 'state.json');
  fs.writeFileSync(state, JSON.stringify({prs: [], environment: protection(), policies: policies(), ...options}));
  const fake = `#!/usr/bin/env node
const fs=require('node:fs'); const path=require('node:path');
const args=process.argv.slice(2), name=path.basename(process.argv[1]);
const state=JSON.parse(fs.readFileSync(process.env.FIXTURE_STATE));
fs.appendFileSync(process.env.FIXTURE_LOG, JSON.stringify([name,...args])+'\\n');
if(name==='gh') {
 if(args[0]==='api') {
  const endpoint=args.at(-1);
  const environment=endpoint.includes('/environments/');
  if(environment && state.environmentStatus) {console.error('HTTP '+state.environmentStatus);process.exit(1);}
  if(environment && state.malformedEnvironment) {console.log('{invalid');process.exit(0);}
  let data=endpoint.endsWith('/environments/sdk-release')?state.environment:endpoint.endsWith('/deployment-branch-policies')?state.policies:state.prs;
  if(data==null) {console.error('HTTP 404');process.exit(1);}
  console.log(JSON.stringify(data));
 }
 else if(args[0]==='pr' && args[1]==='create') {
  if(state.prFailure) process.exit(1); console.log('https://github.com/coda/packs-sdk/pull/42');
 } else process.exit(1);
} else if(name==='pnpm' && args[0]==='exec') {
 if(state.toolFailure) process.exit(1);
 const p=JSON.parse(fs.readFileSync('package.json'));p.version=args[2];if(state.badPackage)p.name='wrong';
 fs.writeFileSync('package.json',JSON.stringify(p));
 fs.writeFileSync('CHANGELOG.md','# Changelog\\n\\n## [Unreleased]\\n\\n## ['+p.version+'] - 2026-10-06\\n\\n### Fixed\\n\\n- Useful fix.\\n');
 if(state.unexpected) fs.writeFileSync('intruder.txt','bad');
 if(state.badLock) fs.writeFileSync('pnpm-lock.yaml','lockfileVersion: 9\\npackages: {evil: {}}\\n');
} else if(name==='make' && args.includes('build')) {fs.writeFileSync('dist/index.js','generated');}
else if(name==='make' && args.includes('validate-no-changes') && state.generatedMismatch) {fs.writeFileSync('dist/index.js','unexpected regeneration');}
`;
  for (const name of ['gh', 'make']) {
    fs.writeFileSync(path.join(bin, name), fake, {mode: 0o755});
  }
  fs.mkdirSync(path.join(cwd, '.pnpm_install/bin'), {recursive: true});
  fs.writeFileSync(path.join(cwd, '.pnpm_install/bin/pnpm'), fake, {mode: 0o755});
  const preload = path.join(root, 'fetch.cjs');
  fs.writeFileSync(
    preload,
    `const fs=require('node:fs');global.fetch=async(url)=>{const s=JSON.parse(fs.readFileSync(process.env.FIXTURE_STATE));
  fs.appendFileSync(process.env.FIXTURE_LOG,JSON.stringify(['HTTP',String(url)])+'\\n');
  if(s.timeout && String(url).includes('versionz')) throw new Error('fetch timed out');
  if(s.httpError) return {ok:false,status:503};
  if(String(url).includes('versionz'))return {ok:true,status:200,json:async()=>s.liveInvalid?{}:{packsSdkVersion:s.liveVersion||'1.17.6'}};
  if(String(url).endsWith('/latest'))return {ok:true,status:200,json:async()=>({version:'1.17.7'})};
  return {ok:false,status:s.registryStatus||404};};`,
  );
  const env = {
    ...process.env,
    PATH: `${bin}:${process.env.PATH}`,
    NODE_OPTIONS: `--require=${preload}`,
    FIXTURE_STATE: state,
    FIXTURE_LOG: log,
    GITHUB_REPOSITORY: 'coda/packs-sdk',
    GITHUB_REF: 'refs/heads/main',
    GITHUB_SHA: sha,
    RELEASE_VERSION: '1.18.0',
    SYNC_CONFIRMED: 'true',
    RELEASE_DRY_RUN: 'true',
  };
  return {
    cwd,
    git,
    sha,
    env,
    state,
    run(overrides = {}) {
      return spawnSync(process.execPath, [cli, 'prepare'], {cwd, env: {...env, ...overrides}, encoding: 'utf8'});
    },
    effects() {
      return fs.existsSync(log) ? fs.readFileSync(log, 'utf8') : '';
    },
  };
}
test('unsafe versions fail without calling any external service', t => {
  const f = fixture(t);
  for (const version of ['patch', 'v1.2.3', '1.2.3-beta.1', '01.2.3', '1.2.3; echo bad', '9007199254740992.0.0']) {
    const r = f.run({RELEASE_VERSION: version});
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /stable version/);
  }
  assert.equal(f.effects(), '');
});
test('dry run validates the candidate and prints its diff without remote writes', t => {
  const f = fixture(t);
  const r = f.run();
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /Useful fix/);
  assert.match(r.stdout, /1.18.0/);
  assert.equal(f.git('ls-remote', 'origin', 'refs/heads/release/v1.18.0'), '');
  assert.doesNotMatch(f.effects(), /"create"|"publish"|"tag"/);
  assert.match(f.effects(), /"make","test","autoformat-all-no-fix","validate-samples"/);
});
test('version tooling cannot change package identity or add source files', t => {
  for (const options of [{badPackage: true}, {unexpected: true}, {badLock: true}]) {
    const f = fixture(t, options);
    const r = f.run();
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /package content|unexpected release path|lock dependency graph/);
    assert.equal(f.git('ls-remote', 'origin', 'refs/heads/release/v1.18.0'), '');
  }
});
test('live preparation creates one bot-authored release commit and one PR', t => {
  const f = fixture(t);
  f.git('config', '--unset', 'user.name');
  f.git('config', '--unset', 'user.email');
  const r = f.run({RELEASE_DRY_RUN: 'false'});
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /pull\/42/);
  assert.equal(f.git('rev-list', '--count', `${f.sha}..HEAD`), '1');
  assert.equal(
    f.git('show', '-s', '--format=%an <%ae>'),
    'github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>',
  );
  assert.match(f.git('ls-remote', 'origin', 'refs/heads/release/v1.18.0'), new RegExp(f.git('rev-parse', 'HEAD')));
  assert.match(f.effects(), /"make","validate-no-changes"/);
  assert.doesNotMatch(f.effects(), /"publish"|"tag"/);
});
test('preparation rejects unmet source and registry prerequisites before tooling', t => {
  const cases = [
    [{prs: [[], [{head: {ref: 'copybara/packs-sdk-snapshot'}}]]}, {}, /open snapshot/],
    [{prs: [{head: {ref: 'release/v1.19.0'}}]}, {}, /different release/],
    [{liveInvalid: true}, {}, /stable version/],
    [{liveVersion: '1.17.5'}, {}, /not live/],
    [{httpError: true}, {}, /HTTP 503/],
    [{registryStatus: 401}, {}, /HTTP 401/],
    [{registryStatus: 429}, {}, /HTTP 429/],
    [{registryStatus: 500}, {}, /HTTP 500/],
    [{}, {RELEASE_VERSION: '1.17.6'}, /increase/],
    [{}, {GITHUB_SHA: 'a'.repeat(40)}, /SHA mismatch/],
    [{}, {GITHUB_REPOSITORY: 'attacker/packs-sdk'}, /untrusted/],
    [{toolFailure: true}, {}, /Command failed/],
  ];
  for (const [options, env, expected] of cases) {
    const f = fixture(t, options),
      r = f.run(env);
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, expected);
    assert.doesNotMatch(f.effects(), /"create"|"publish"/);
  }
});
test('missing reviewed tool export or an npm lock blocks preparation', t => {
  for (const name of ['package-lock.json', 'old-tool']) {
    const f = fixture(t);
    if (name === 'old-tool') {
      const pkg = JSON.parse(fs.readFileSync(path.join(f.cwd, 'package.json')));
      pkg.devDependencies['release-it'] = '17.11.0';
      fs.writeFileSync(path.join(f.cwd, 'package.json'), JSON.stringify(pkg));
    } else fs.writeFileSync(path.join(f.cwd, name), '{}');
    f.git('add', '.');
    f.git('commit', '-m', 'Prerequisite');
    f.env.GITHUB_SHA = f.git('rev-parse', 'HEAD');
    const r = f.run();
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /export required|npm lockfile/);
    assert.doesNotMatch(f.effects(), /"pnpm","exec"|"HTTP"/);
  }
});
test('same prepared PR retry returns its identity without repeating tooling', t => {
  const f = fixture(t);
  const first = f.run({RELEASE_DRY_RUN: 'false'});
  assert.equal(first.status, 0, first.stderr);
  const head = f.git('rev-parse', 'HEAD');
  f.git('switch', 'main');
  fs.writeFileSync(
    f.state,
    JSON.stringify({
      environment: protection(),
      policies: policies(),
      prs: [
        {
          head: {ref: 'release/v1.18.0', sha: head, repo: {full_name: 'coda/packs-sdk'}},
          base: {ref: 'main', repo: {full_name: 'coda/packs-sdk'}},
          body: `<!-- packs-sdk-release version=1.18.0 source=${f.sha} sync-confirmed=true -->`,
          html_url: 'https://github.com/coda/packs-sdk/pull/42',
        },
      ],
    }),
  );
  const before = f.effects();
  const r = f.run({RELEASE_DRY_RUN: 'false'});
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /pull\/42/);
  assert.doesNotMatch(f.effects().slice(before.length), /"release-it"|"create"/);
});
test('retry recovers a pushed branch after PR creation failed without another commit', t => {
  const f = fixture(t, {prFailure: true});
  const first = f.run({RELEASE_DRY_RUN: 'false'});
  assert.notEqual(first.status, 0);
  assert.match(first.stdout, /Partial preparation/);
  const head = f.git('rev-parse', 'HEAD');
  f.git('switch', 'main');
  fs.writeFileSync(f.state, JSON.stringify({prs: [], environment: protection(), policies: policies()}));
  const r = f.run({RELEASE_DRY_RUN: 'false'});
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /pull\/42/);
  assert.equal(f.git('rev-parse', 'HEAD'), head);
});
test('changed or stale existing prepared PR is rejected', t => {
  const f = fixture(t);
  assert.equal(f.run({RELEASE_DRY_RUN: 'false'}).status, 0);
  const head = f.git('rev-parse', 'HEAD');
  f.git('switch', 'main');
  fs.writeFileSync(
    f.state,
    JSON.stringify({
      environment: protection(),
      policies: policies(),
      prs: [
        {
          head: {ref: 'release/v1.18.0', sha: head, repo: {full_name: 'coda/packs-sdk'}},
          base: {ref: 'main', repo: {full_name: 'coda/packs-sdk'}},
          body: 'bad marker',
        },
      ],
    }),
  );
  const r = f.run({RELEASE_DRY_RUN: 'false'});
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /marker/);
});
test('empty Unreleased and a stale remote release branch cannot be prepared', t => {
  const empty = fixture(t);
  fs.writeFileSync(path.join(empty.cwd, 'CHANGELOG.md'), '# Changelog\n\n## [Unreleased]\n');
  empty.git('add', '.');
  empty.git('commit', '-m', 'Empty changes');
  empty.env.GITHUB_SHA = empty.git('rev-parse', 'HEAD');
  empty.git('push', 'origin', 'main');
  const r = empty.run();
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /Unreleased changelog is empty/);
  const stale = fixture(t);
  assert.equal(stale.run({RELEASE_DRY_RUN: 'false'}).status, 0);
  stale.git('switch', 'main');
  fs.writeFileSync(path.join(stale.cwd, 'another.txt'), 'New source');
  stale.git('add', '.');
  stale.git('commit', '-m', 'Advance source');
  stale.git('push', 'origin', 'main');
  stale.env.GITHUB_SHA = stale.git('rev-parse', 'HEAD');
  const retry = stale.run();
  assert.notEqual(retry.status, 0);
  assert.match(retry.stderr, /stale\/conflicting release branch source/);
});
test('live-version timeout stops before remote release writes', t => {
  const f = fixture(t, {timeout: true});
  const r = f.run();
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /timed out/);
  assert.doesNotMatch(f.effects(), /"release-it"|"create"|"publish"/);
});
test('generated-output drift after the release commit prevents pushing the branch', t => {
  const f = fixture(t, {generatedMismatch: true});
  const r = f.run({RELEASE_DRY_RUN: 'false'});
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /generated-output mismatch/);
  assert.equal(f.git('ls-remote', 'origin', 'refs/heads/release/v1.18.0'), '');
});

test('preparation refuses missing or wrong-team protection before release effects', t => {
  for (const environment of [
    null,
    {protection_rules: [{type: 'required_reviewers', reviewers: [{type: 'Team', reviewer: {id: 1}}]}]},
  ]) {
    for (const dryRun of ['true', 'false']) {
      const f = fixture(t, {environment});
      const result = f.run({RELEASE_DRY_RUN: dryRun});
      assert.notEqual(result.status, 0);
      assert.doesNotMatch(f.effects(), /"pnpm","exec"|"pr","create"|"npm","publish"/);
      assert.equal(f.git('branch', '--list', 'release/v1.18.0'), '');
      assert.equal(f.git('ls-remote', 'origin', 'refs/heads/release/v1.18.0'), '');
      assert.equal(f.git('ls-remote', 'origin', 'refs/tags/v*'), '');
    }
  }
});

test('preparation rejects weakened or malformed policies in dry and live runs', t => {
  const changed = change => {
    const environment = protection();
    change(environment);
    return {environment};
  };
  const cases = [
    {environmentStatus: 403},
    {environmentStatus: 404},
    {malformedEnvironment: true},
    {environment: {}},
    changed(e => (e.protection_rules = {})),
    changed(e => (e.protection_rules = [])),
    changed(e => e.protection_rules.push(e.protection_rules[0])),
    changed(e => (e.protection_rules[0].reviewers = {})),
    changed(e => (e.protection_rules[0].reviewers = [])),
    changed(e => (e.protection_rules[0].reviewers[0].type = 'User')),
    changed(e => (e.protection_rules[0].reviewers[0].reviewer.id = 1)),
    changed(e => (e.protection_rules[0].reviewers[0].reviewer.slug = 'other')),
    changed(e => e.protection_rules[0].reviewers.push({type: 'User', reviewer: {id: 2}})),
    changed(e => (e.protection_rules[0].prevent_self_review = false)),
    changed(e => delete e.protection_rules[0].prevent_self_review),
    changed(e => (e.can_admins_bypass = true)),
    changed(e => delete e.can_admins_bypass),
    changed(e => (e.deployment_branch_policy.custom_branch_policies = false)),
    changed(e => (e.deployment_branch_policy.protected_branches = true)),
    {policies: {}},
    {policies: []},
    {policies: [{}]},
    {policies: [{branch_policies: {}}]},
    {policies: [{branch_policies: [{name: 'main', type: 'branch'}]}]},
    {policies: [{branch_policies: [{name: 'v*', type: 'tag'}]}]},
    {policies: [{branch_policies: [...policies()[0].branch_policies, {name: '*', type: 'branch'}]}]},
    {policies: [{branch_policies: [null]}]},
  ];
  for (const options of cases)
    for (const dryRun of ['true', 'false']) {
      const f = fixture(t, options);
      const r = f.run({RELEASE_DRY_RUN: dryRun});
      assert.notEqual(r.status, 0, JSON.stringify(options));
      assert.doesNotMatch(f.effects(), /"pnpm","exec"|"pr","create"|"npm","publish"|npm-release/);
      assert.equal(f.git('branch', '--list', 'release/v1.18.0'), '');
      assert.equal(f.git('ls-remote', 'origin', 'refs/heads/release/v1.18.0'), '');
      assert.equal(f.git('ls-remote', 'origin', 'refs/tags/v*'), '');
    }
});
test('preparation accepts explicit main and tag policies across empty and multiple API pages', t => {
  const f = fixture(t, {
    policies: [
      {branch_policies: []},
      {branch_policies: [{name: 'main', type: 'branch'}]},
      {branch_policies: [{name: 'v*', type: 'tag'}]},
    ],
  });
  assert.equal(f.run().status, 0);
  assert.match(f.effects(), /"--paginate","--slurp"/);
});
test('preparation workflow requires team approval without npm OIDC', () => {
  const workflow = require('js-yaml').load(
    fs.readFileSync(path.join(__dirname, '../workflows/prepare-release.yml'), 'utf8'),
  );
  assert.equal(workflow.jobs.prepare.environment, 'sdk-release');
  assert.equal(workflow.jobs.prepare.permissions.actions, 'read');
  assert.notEqual(workflow.jobs.prepare.permissions['id-token'], 'write');
  assert.notEqual(workflow.permissions?.['id-token'], 'write');
});
