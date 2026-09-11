import type {ArgumentsCamelCase} from 'yargs';
import type {PluginComponentMetadata} from '../plugin/listing';
import type {PluginListing} from '../plugin/listing';
import {PluginListingError} from '../plugin/listing';
import {PluginListingFileName} from '../plugin/listing';
import type {PluginOutput} from './plugin_output';
import {formatPluginPublishPlan} from '../plugin/listing';
import {formatScaffoldResult} from './plugin_output';
import {isExistingPlugin} from './plugin_output';
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
  output: PluginOutput;
}

interface PluginJsonArgs {
  pluginJson?: string;
  output: PluginOutput;
}

export async function handleAddPlugin({name, output}: ArgumentsCamelCase<AddPluginArgs>) {
  const pluginName = name || 'my-plugin';
  const targetDir = path.resolve(process.cwd(), pluginName);
  const pluginJsonPath = path.join(targetDir, PluginListingFileName);
  if (isExistingPlugin(pluginJsonPath, pluginName)) {
    return printAndExit(formatScaffoldResult(pluginName, targetDir, 'unchanged', output), 0);
  }
  try {
    scaffoldPlugin(targetDir, pluginName);
  } catch (err: unknown) {
    return printAndExit(err instanceof PluginListingError ? err.message : String(err));
  }
  return printAndExit(formatScaffoldResult(pluginName, targetDir, 'created', output), 0);
}

export async function handlePluginValidate({pluginJson, output}: ArgumentsCamelCase<PluginJsonArgs>) {
  const pluginJsonPath = path.resolve(process.cwd(), pluginJson || PluginListingFileName);
  try {
    const listing = loadPluginListing(pluginJsonPath);
    const pluginRoot = path.dirname(pluginJsonPath);
    validatePluginListing(listing, pluginRoot);
    await validatePluginComponents(listing, pluginRoot);
    const result =
      output === 'json'
        ? JSON.stringify({valid: true, name: listing.name, pluginJson: pluginJsonPath}, null, 2)
        : `Plugin definition is valid: ${pluginJsonPath}`;
    return printAndExit(result, 0);
  } catch (err: unknown) {
    return printAndExit(err instanceof PluginListingError ? err.message : String(err));
  }
}

export async function handlePluginPlan({pluginJson, output}: ArgumentsCamelCase<PluginJsonArgs>) {
  const pluginJsonPath = path.resolve(process.cwd(), pluginJson || PluginListingFileName);
  try {
    const listing = loadPluginListing(pluginJsonPath);
    const pluginRoot = path.dirname(pluginJsonPath);
    validatePluginListing(listing, pluginRoot);
    const componentMetadata = await validatePluginComponents(listing, pluginRoot);
    const plan = planPluginPublish(pluginJsonPath, componentMetadata);
    return printAndExit(output === 'json' ? JSON.stringify(plan, null, 2) : formatPluginPublishPlan(plan), 0);
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
