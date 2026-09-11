import {PluginListingFileName} from '../plugin/listing';
import {loadPluginListing} from '../plugin/listing';
import path from 'path';
import {validatePluginListing} from '../plugin/listing';

export type PluginOutput = 'text' | 'json';

export function isExistingPlugin(pluginJsonPath: string, expectedName: string): boolean {
  try {
    const listing = loadPluginListing(pluginJsonPath);
    validatePluginListing(listing, path.dirname(pluginJsonPath));
    return listing.name === expectedName;
  } catch {
    return false;
  }
}

export function formatScaffoldResult(
  pluginName: string,
  targetDir: string,
  status: 'created' | 'unchanged',
  output: PluginOutput,
): string {
  const pluginJson = path.join(targetDir, PluginListingFileName);
  const files = [
    pluginJson,
    path.join(targetDir, 'SETUP.md'),
    path.join(targetDir, 'agent', 'pack.ts'),
    path.join(targetDir, 'connector', 'pack.ts'),
  ];
  if (output === 'json') {
    return JSON.stringify(
      {
        status,
        name: pluginName,
        directory: targetDir,
        pluginJson,
        files,
        next: {
          validate: `coda plugin validate ${pluginJson}`,
          plan: `coda plugin plan ${pluginJson}`,
        },
      },
      null,
      2,
    );
  }
  if (status === 'unchanged') {
    return `Plugin already scaffolded at ${targetDir}. No change needed.`;
  }
  return [
    `Scaffolded plugin listing at ${targetDir}`,
    `  ${PluginListingFileName}  (directory listing: agent + connector packs)`,
    '  SETUP.md',
    '  agent/pack.ts',
    '  connector/pack.ts',
    '',
    `Next: coda plugin validate ${pluginJson}`,
    `Then: coda plugin plan ${pluginJson}`,
  ].join('\n');
}
