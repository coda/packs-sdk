import type {ArgumentsCamelCase} from 'yargs';
import {PluginListingError} from '../plugin/listing';
import {PluginListingFileName} from '../plugin/listing';
import {formatPluginPublishPlan} from '../plugin/listing';
import {loadPluginListing} from '../plugin/listing';
import path from 'path';
import {planPluginPublish} from '../plugin/listing';
import {printAndExit} from '../testing/helpers';
import {scaffoldPlugin} from '../plugin/listing';
import {validatePluginListing} from '../plugin/listing';

interface AddPluginArgs {
  name?: string;
}

interface BundlePluginArgs {
  pluginJson?: string;
}

export async function handleAddPlugin({name}: ArgumentsCamelCase<AddPluginArgs>) {
  const pluginName = name || 'my-plugin';
  const targetDir = path.resolve(process.cwd(), pluginName);
  try {
    scaffoldPlugin(targetDir, pluginName);
  } catch (err: unknown) {
    return printAndExit(err instanceof PluginListingError ? err.message : String(err));
  }
  return printAndExit(
    [
      `SPIKE: scaffolded plugin listing at ${targetDir}`,
      `  ${PluginListingFileName}  (directory listing: agent + connector packs)`,
      '  SETUP.md',
      '  agent/pack.ts',
      '  connector/pack.ts',
      '',
      'Next: coda plugin validate ' + path.join(pluginName, PluginListingFileName),
      'Then: coda plugin plan ' + path.join(pluginName, PluginListingFileName),
    ].join('\n'),
    0,
  );
}

export async function handlePluginValidate({pluginJson}: ArgumentsCamelCase<BundlePluginArgs>) {
  const pluginJsonPath = path.resolve(process.cwd(), pluginJson || PluginListingFileName);
  try {
    const listing = loadPluginListing(pluginJsonPath);
    validatePluginListing(listing, path.dirname(pluginJsonPath));
    return printAndExit(`Plugin definition is valid: ${pluginJsonPath}`, 0);
  } catch (err: unknown) {
    return printAndExit(err instanceof PluginListingError ? err.message : String(err));
  }
}

export async function handlePluginPlan({pluginJson}: ArgumentsCamelCase<BundlePluginArgs>) {
  const pluginJsonPath = path.resolve(process.cwd(), pluginJson || PluginListingFileName);
  try {
    const plan = planPluginPublish(pluginJsonPath);
    return printAndExit(formatPluginPublishPlan(plan), 0);
  } catch (err: unknown) {
    return printAndExit(err instanceof PluginListingError ? err.message : String(err));
  }
}
