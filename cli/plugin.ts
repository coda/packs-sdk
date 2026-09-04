import type {ArgumentsCamelCase} from 'yargs';
import type {PluginComponentMetadata} from '../plugin/listing';
import type {PluginListing} from '../plugin/listing';
import {PluginListingError} from '../plugin/listing';
import {PluginListingFileName} from '../plugin/listing';
import {formatPluginPublishPlan} from '../plugin/listing';
import {loadPackMetadataForValidation} from './validate';
import {loadPluginListing} from '../plugin/listing';
import path from 'path';
import {planPluginPublish} from '../plugin/listing';
import {printAndExit} from '../testing/helpers';
import {scaffoldPlugin} from '../plugin/listing';
import {validateMetadataOrThrow} from './validate';
import {validatePluginComponentMetadata} from '../plugin/listing';
import {validatePluginComponentType} from '../plugin/listing';
import {validatePluginListing} from '../plugin/listing';

interface AddPluginArgs {
  name?: string;
}

interface PluginJsonArgs {
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
      `Scaffolded plugin listing at ${targetDir}`,
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

export async function handlePluginValidate({pluginJson}: ArgumentsCamelCase<PluginJsonArgs>) {
  const pluginJsonPath = path.resolve(process.cwd(), pluginJson || PluginListingFileName);
  try {
    const listing = loadPluginListing(pluginJsonPath);
    const pluginRoot = path.dirname(pluginJsonPath);
    validatePluginListing(listing, pluginRoot);
    await validatePluginComponents(listing, pluginRoot);
    return printAndExit(`Plugin definition is valid: ${pluginJsonPath}`, 0);
  } catch (err: unknown) {
    return printAndExit(err instanceof PluginListingError ? err.message : String(err));
  }
}

export async function handlePluginPlan({pluginJson}: ArgumentsCamelCase<PluginJsonArgs>) {
  const pluginJsonPath = path.resolve(process.cwd(), pluginJson || PluginListingFileName);
  try {
    const listing = loadPluginListing(pluginJsonPath);
    const pluginRoot = path.dirname(pluginJsonPath);
    validatePluginListing(listing, pluginRoot);
    const componentMetadata = await validatePluginComponents(listing, pluginRoot);
    const plan = planPluginPublish(pluginJsonPath, componentMetadata);
    return printAndExit(formatPluginPublishPlan(plan), 0);
  } catch (err: unknown) {
    return printAndExit(err instanceof PluginListingError ? err.message : String(err));
  }
}

export async function validatePluginComponents(
  listing: PluginListing,
  pluginRoot: string,
): Promise<PluginComponentMetadata> {
  const componentMetadata: PluginComponentMetadata = {};
  for (const [componentName, component] of Object.entries(listing.components)) {
    if (component.type !== 'agent' && component.type !== 'connector') {
      continue;
    }
    const manifestPath = path.resolve(pluginRoot, component.manifest);
    try {
      const metadata = await loadPackMetadataForValidation(manifestPath);
      await validateMetadataOrThrow(metadata);
      validatePluginComponentType(componentName, component, metadata);
      componentMetadata[componentName] = metadata;
    } catch (err: unknown) {
      if (err instanceof PluginListingError) {
        throw err;
      }
      const detail = err instanceof Error ? err.message : String(err);
      throw new PluginListingError(`Invalid ${component.type} component ${componentName}: ${detail}`);
    }
  }
  validatePluginComponentMetadata(listing, componentMetadata);
  return componentMetadata;
}
