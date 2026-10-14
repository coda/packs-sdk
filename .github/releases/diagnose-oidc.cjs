// Run inside publish-release.yml on a GitHub-hosted runner using sdk-release.
// Requires npm 11.15.0 and .pnpm_install/bin/pnpm 10.28.2.
// Uses npm stage publish --dry-run with a temporary package. Never submits it.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {execFileSync, spawn} = require('node:child_process');

const registry = 'https://registry.npmjs.org/';
const packageName = '@codahq/packs-sdk';

function child(program, args, env) {
  return new Promise((resolve, reject) => {
    const proc = spawn(program, args, {
      env,
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 90000,
      killSignal: 'SIGKILL',
    });
    let stdout = '';
    proc.stdout.on('data', data => {
      stdout += data;
    });
    proc.on('error', reject);
    proc.on('close', (exitCode, signal) => resolve({exitCode, signal, stdout}));
  });
}

async function main() {
  if (process.env.GITHUB_ACTIONS !== 'true') {
    throw Error('Run this inside the trusted GitHub Actions workflow, not locally.');
  }
  const requestUrl = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  const requestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  if (!requestUrl || !requestToken) throw Error('id-token: write credentials are unavailable.');

  const commandOptions = {encoding: 'utf8', timeout: 30000, stdio: ['ignore', 'pipe', 'ignore']};
  const npm = execFileSync('which', ['npm'], commandOptions).trim();
  const npmVersion = execFileSync(npm, ['--version'], commandOptions).trim();
  if (npmVersion !== '11.15.0') throw Error('Install npm 11.15.0 to reproduce the failing job.');
  const pnpm = path.resolve('.pnpm_install/bin/pnpm');
  if (!fs.existsSync(pnpm)) throw Error('Install the project pnpm before running this comparison.');
  const pnpmVersion = execFileSync(pnpm, ['--version'], commandOptions).trim();
  if (pnpmVersion !== '10.28.2') throw Error('Use pnpm 10.28.2 to reproduce the failing job.');

  const url = new URL(requestUrl);
  url.searchParams.set('audience', 'npm:registry.npmjs.org');
  const response = await fetch(url, {
    headers: {Accept: 'application/json', Authorization: `Bearer ${requestToken}`},
    signal: AbortSignal.timeout(30000),
  });
  console.log(`GitHub identity-token request: HTTP ${response.status}.`);
  if (!response.ok) throw Error(`GitHub identity-token request returned HTTP ${response.status}.`);
  const {value: token} = await response.json();
  if (typeof token !== 'string' || token.split('.').length !== 3) throw Error('GitHub did not return a JWT.');
  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
  const keys = [
    'iss',
    'aud',
    'sub',
    'repository',
    'repository_id',
    'repository_owner',
    'repository_owner_id',
    'workflow_ref',
    'job_workflow_ref',
    'environment',
    'runner_environment',
    'iat',
    'exp',
  ];
  console.log(JSON.stringify({identity: Object.fromEntries(keys.map(key => [key, payload[key] ?? null]))}, null, 2));

  const dir = fs.mkdtempSync(path.join(process.env.RUNNER_TEMP || os.tmpdir(), 'sdk-oidc-comparison-'));
  try {
    const probe = path.join(dir, 'package');
    fs.mkdirSync(probe);
    fs.writeFileSync(
      path.join(probe, 'package.json'),
      JSON.stringify({name: packageName, version: '0.0.0-oidc-probe'}),
    );
    const userConfig = path.join(dir, 'empty-user.npmrc');
    const globalConfig = path.join(dir, 'empty-global.npmrc');
    fs.writeFileSync(userConfig, '');
    fs.writeFileSync(globalConfig, '');
    const env = {...process.env, NPM_ID_TOKEN: token};
    for (const key of Object.keys(env)) {
      if (key.toLowerCase() === 'npm_config_user_agent') delete env[key];
    }
    const configArgs = ['--userconfig', userConfig, '--globalconfig', globalConfig];
    const cases = [
      {label: 'npm directly', program: npm, prefix: []},
      {label: 'npm through pnpm exec', program: pnpm, prefix: ['exec', npm]},
      {
        label: 'pnpm exec with user-agent cleared',
        program: pnpm,
        prefix: ['exec', 'env', '-u', 'npm_config_user_agent', '-u', 'NPM_CONFIG_USER_AGENT', npm],
      },
    ];
    const results = [];
    for (let index = 0; index < cases.length; index++) {
      const {label, program, prefix} = cases[index];
      const logDir = path.join(dir, `logs-${index}`);
      fs.mkdirSync(logDir);
      const agent = await child(program, [...prefix, 'config', 'get', 'user-agent', ...configArgs], env);
      const result = await child(
        program,
        [
          ...prefix,
          'stage',
          'publish',
          probe,
          '--dry-run',
          '--ignore-scripts',
          '--provenance=false',
          '--tag',
          'oidc-probe',
          '--registry',
          registry,
          '--fetch-retries',
          '0',
          '--fetch-timeout',
          '30000',
          '--logs-dir',
          logDir,
          '--logs-max',
          '10',
          ...configArgs,
        ],
        env,
      );
      const logs = fs
        .readdirSync(logDir)
        .filter(file => file.endsWith('.log'))
        .map(file => fs.readFileSync(path.join(logDir, file), 'utf8'))
        .join('\n');
      const status = logs.match(/http fetch POST (\d+) .*\/oidc\/token\/exchange\/package\//)?.[1] ?? null;
      const exchangedToken = logs.includes('oidc Successfully retrieved and set token');
      // Dry runs can exit successfully even when authentication fails; use the OIDC result.
      const entry = {
        label,
        configuredUserAgent: agent.exitCode === 0 ? agent.stdout.trim() : null,
        exchangeHttpStatus: status === null ? null : Number(status),
        exchangedToken,
        commandExitCode: result.exitCode,
        terminationSignal: result.signal,
      };
      results.push(entry);
      console.log(JSON.stringify(entry));
    }
    console.log('No package was submitted. No git refs or GitHub releases were changed.');
    if (!results.some(result => result.exchangedToken)) process.exitCode = 1;
  } finally {
    fs.rmSync(dir, {recursive: true, force: true});
  }
}

main().catch(() => {
  // Avoid printing arbitrary errors, HTTP bodies, or identity tokens.
  console.error('OIDC comparison could not complete. Check tool versions and workflow permissions.');
  process.exitCode = 1;
});
