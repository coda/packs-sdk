const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const fs = require('node:fs');
const REPOSITORY = 'coda/packs-sdk';
const PNPM = '.pnpm_install/bin/pnpm';

function command(program, args, options = {}) {
  return execFileSync(program, args, {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...options}).trim();
}
const git = (...args) => command('git', args);
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
function api(endpoint, paginated = false) {
  return JSON.parse(
    command('gh', ['api', ...(paginated ? ['--paginate', '--slurp'] : []), `repos/${REPOSITORY}/${endpoint}`]),
  );
}
function summary(message, env) {
  console.log(message);
  if (env.GITHUB_STEP_SUMMARY) fs.appendFileSync(env.GITHUB_STEP_SUMMARY, `${message}\n`);
}
function outputs(values, env) {
  for (const [key, value] of Object.entries(values)) {
    assert.match(String(value), /^[a-zA-Z0-9./_-]+$/, 'unsafe workflow output');
    const line = `${key}=${value}`;
    console.log(line);
    if (env.GITHUB_OUTPUT) fs.appendFileSync(env.GITHUB_OUTPUT, `${line}\n`);
  }
}
function releaseIt(args, env, identity = {}) {
  try {
    summary(command(PNPM, ['exec', 'release-it', ...args], {env: {...env, ...identity}}), env);
  } catch (error) {
    if (error.stdout) summary(String(error.stdout), env);
    throw error;
  }
}
async function prepare(env) {
  assert.equal(env.SYNC_CONFIRMED, 'true', 'sync confirmation is required');
  assert.equal(git('status', '--porcelain'), '', 'checkout must be clean');
  const originalVersion = readJson('package.json').version;
  releaseIt(
    ['--ci', '--quiet', '--config', '.github/releases/prepare.config.cjs', `--increment=${env.RELEASE_VERSION}`],
    env,
  );
  const version = readJson('package.json').version;
  if (version === originalVersion) {
    summary('No new version selected; no release PR created.', env);
    return;
  }
  const branch = `release/v${version}`;
  git('switch', '-c', branch);
  command(PNPM, ['install', '--frozen-lockfile']);
  command('make', ['build']);
  if (env.RELEASE_DRY_RUN !== 'false') {
    summary(git('diff'), env);
    summary(`Dry run: ${version}; no branch pushed or PR created.`, env);
    return;
  }
  git('add', '--all');
  command('git', ['commit', '-m', `packs-sdk: release v${version}`], {
    env: {
      ...env,
      GIT_AUTHOR_NAME: 'github-actions[bot]',
      GIT_COMMITTER_NAME: 'github-actions[bot]',
      GIT_AUTHOR_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com',
      GIT_COMMITTER_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com',
    },
  });
  git('push', 'origin', `HEAD:refs/heads/${branch}`);
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
    '--body',
    'Review the changelog and diff, then merge after CI passes. Approve bot-created workflow runs if requested. ' +
      'Complete documentation deployments and the internal dependency update in the release runbook after publication.',
  ]);
  summary(`Prepared ${url}\nBranch: ${branch}\nCommit: ${git('rev-parse', 'HEAD')}`, env);
}
async function inspect(env) {
  let pr;
  if (env.GITHUB_EVENT_NAME === 'workflow_dispatch') {
    assert.match(env.RELEASE_PR || '', /^[1-9]\d*$/, 'positive numeric release PR required');
    pr = api(`pulls/${env.RELEASE_PR}`);
  } else {
    pr = api(`commits/${env.GITHUB_SHA}/pulls`, true)
      .flat()
      .find(pr => pr.merged_at && pr.merge_commit_sha === env.GITHUB_SHA && pr.head.ref.startsWith('release/v'));
  }
  if (!pr) return outputs({eligible: 'false'}, env);
  assert(pr.head.ref.startsWith('release/v'), 'PR must be created by Prepare SDK release');
  assert(pr.merged || pr.merged_at, 'release PR must be merged');
  assert.equal(pr.merge_commit_sha, env.GITHUB_SHA, 'run at the release PR merge commit');
  outputs({eligible: 'true', sha: pr.merge_commit_sha, pr: String(pr.number)}, env);
}
async function publish(env) {
  assert.equal(env.PACKS_SDK_PUBLISH_ENABLED, 'true', 'publication is disabled');
  assert.equal(env.RELEASE_DRY_RUN, 'false', 'publication requires an explicit live run');
  assert.equal(git('status', '--porcelain'), '', 'publish checkout must be clean');
  const args = ['--ci', '--no-increment', '--quiet', '--config', '.github/releases/publish.config.cjs'];
  if (env.RELEASE_SKIP_NPM === 'true') args.push('--no-npm.publish');
  releaseIt(args, env, {
    GIT_COMMITTER_NAME: 'github-actions[bot]',
    GIT_COMMITTER_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com',
  });
  summary('Approve the npm stage, then publish the GitHub draft. Inspect both services before retrying.', env);
}
async function main(env = process.env) {
  if (process.argv[2] === 'publish') return publish(env);
  if (process.argv[2] === 'inspect') return inspect(env);
  assert.equal(process.argv[2], 'prepare', 'unknown release command');
  return prepare(env);
}
main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
