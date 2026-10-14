async function diagnose() {
  const requestUrl = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  const requestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  if (!requestUrl || !requestToken) throw new Error('GitHub OIDC request credentials are unavailable.');
  const url = new URL(requestUrl);
  url.searchParams.append('audience', 'npm:registry.npmjs.org');
  const github = await fetch(url, {
    headers: {Authorization: `Bearer ${requestToken}`},
    signal: AbortSignal.timeout(30000),
  });
  console.log(`GitHub identity-token request: HTTP ${github.status}`);
  if (!github.ok) throw new Error('GitHub did not issue an identity token.');
  const {value: token} = await github.json();
  if (typeof token !== 'string' || token.split('.').length !== 3) {
    throw new Error('GitHub did not return a JWT.');
  }
  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'));
  const fields = [
    'iss',
    'aud',
    'sub',
    'repository',
    'repository_id',
    'repository_owner',
    'repository_owner_id',
    'workflow_ref',
    'job_workflow_ref',
    'event_name',
    'environment',
    'runner_environment',
    'iat',
    'exp',
  ];
  const claims = Object.fromEntries(fields.map(field => [field, payload[field] ?? null]));
  console.log(`Selected identity fields: ${JSON.stringify(claims, null, 2)}`);
  const exchange = await fetch('https://registry.npmjs.org/-/npm/v1/oidc/token/exchange/package/@codahq%2fpacks-sdk', {
    method: 'POST',
    headers: {Authorization: `Bearer ${token}`},
    signal: AbortSignal.timeout(30000),
  });
  console.log(`npm token exchange: HTTP ${exchange.status}`);
  // Do not read or print the exchange response, which contains a credential on success.
  if (exchange.body) await exchange.body.cancel();
  if (!exchange.ok) throw new Error('npm rejected the identity token.');
  console.log('npm accepted the identity token. No package was submitted.');
}
diagnose().catch(() => {
  // Errors may contain response bodies or request details; print only a fixed message.
  console.error('OIDC diagnostic failed. See the request statuses and selected identity fields above.');
  process.exitCode = 1;
});
