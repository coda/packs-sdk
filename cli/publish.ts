import type {AllPacks} from './create';
import type {Arguments} from 'yargs';
import type {Authentication} from '../types';
import type {AuthenticationMetadata} from '../compiled_types';
import {AuthenticationType} from '../types';
import {ConsoleLogger} from '../helpers/logging';
import type {Format} from '../types';
import type {GenericSyncTable} from '../api';
import type {MetadataFormula} from '../api';
import type {MetadataFormulaMetadata} from '../api';
import type {PackDefinition} from '../types';
import type {PackFormatMetadata} from '../compiled_types';
import type {PackFormulaMetadata} from '../api';
import type {PackFormulas} from '../api';
import type {PackFormulasMetadata} from '../compiled_types';
import type {PackMetadata} from '../compiled_types';
import type {PackSyncTable} from '../compiled_types';
import type {PackUpload} from '../compiled_types';
import type {PostSetup} from '../types';
import type {PostSetupMetadata} from '../compiled_types';
import type {TypedPackFormula} from '../api';
import type {TypedStandardFormula} from '../api';
import {build} from './build';
import {createCodaClient} from './helpers';
import {ensureExists} from '../helpers/ensure';
import {formatEndpoint} from './helpers';
import {getApiKey} from './helpers';
import {isDynamicSyncTable} from '../api';
import {isTestCommand} from './helpers';
import {printAndExit} from '../testing/helpers';
import {readFile} from '../testing/helpers';
import {readPacksFile} from './create';
import requestPromise from 'request-promise-native';
import {validateMetadata} from './validate';

interface PublishArgs {
  manifestFile: string;
  codaApiEndpoint: string;
}

export async function handlePublish({manifestFile, codaApiEndpoint}: Arguments<PublishArgs>) {
  const formattedEndpoint = formatEndpoint(codaApiEndpoint);
  const logger = new ConsoleLogger();
  const {manifest} = await import(manifestFile);
  logger.info('Building Pack bundle...');
  const bundleFilename = await build(manifestFile);

  // Since package.json isn't in dist, we grab it from the root directory instead.
  const packageJson = await import(isTestCommand() ? '../package.json' : '../../package.json');
  const codaPacksSDKVersion = packageJson.version;
  codaPacksSDKVersion!;

  const apiKey = getApiKey();
  if (!apiKey) {
    printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
  }

  const client = createCodaClient(apiKey, formattedEndpoint);

  const packs: AllPacks | undefined = readPacksFile();
  const packId = packs && packs[manifest.name];
  if (!packId) {
    printAndExit(`Could not find a Pack id registered to Pack "${manifest.name}"`);
  }

  const packVersion = manifest.version;
  if (!packVersion) {
    printAndExit(`No Pack version found for your Pack "${manifest.name}"`);
  }

  //  TODO(alan): error testing
  try {
    logger.info('Registering new Pack version...');
    const {uploadUrl} = await client.registerPackVersion(packId, packVersion);

    // TODO(alan): only grab metadata from manifest.
    logger.info('Validating Pack metadata...');
    await validateMetadata(manifest);

    logger.info('Uploading Pack...');
    const metadata = compilePackMetadata(manifest);
    await uploadPackToSignedUrl(bundleFilename, metadata, uploadUrl);

    logger.info('Validating upload...');
    await client.packVersionUploadComplete(packId, packVersion);
  } catch (err) {
    printAndExit(`Error: ${err}`);
  }

  logger.info('Done!');
}

async function uploadPackToSignedUrl(bundleFilename: string, metadata: PackMetadata, uploadUrl: string) {
  const bundle = readFile(bundleFilename);
  if (!bundle) {
    printAndExit(`Could not find bundle file at path ${bundleFilename}`);
  }

  const upload: PackUpload = {
    metadata,
    bundle: bundle.toString(),
  };

  try {
    await requestPromise.put(uploadUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      json: upload,
    });
  } catch (err) {
    printAndExit(`Error in uploading Pack to signed url: ${err}`);
  }
}

function compilePackMetadata(manifest: PackDefinition): PackMetadata {
  const {formats, formulas, formulaNamespace, syncTables, defaultAuthentication, ...definition} = manifest;
  const compiledFormats = compileFormatsMetadata(formats || []);
  const compiledFormulas = (formulas && compileFormulasMetadata(formulas)) || (Array.isArray(formulas) ? [] : {});
  const defaultAuthenticationMetadata = compileDefaultAuthenticationMetadata(defaultAuthentication);
  const metadata: PackMetadata = {
    ...definition,
    defaultAuthentication: defaultAuthenticationMetadata,
    formulaNamespace,
    formats: compiledFormats,
    formulas: compiledFormulas,
    syncTables: (syncTables || []).map(compileSyncTable),
  };

  return metadata;
}

function compileFormatsMetadata(formats: Format[]): PackFormatMetadata[] {
  return formats.map(format => {
    return {
      ...format,
      matchers: (format.matchers || []).map(matcher => matcher.toString()),
    };
  });
}

function compileFormulasMetadata(
  formulas: PackFormulas | TypedStandardFormula[],
): PackFormulasMetadata | PackFormulaMetadata[] {
  const formulasMetadata: PackFormulaMetadata[] | PackFormulasMetadata = Array.isArray(formulas) ? [] : {};
  // TODO: @alan-fang delete once we move packs off of PackFormulas
  if (Array.isArray(formulas)) {
    (formulasMetadata as PackFormulaMetadata[]).push(...formulas.map(compileFormulaMetadata));
  } else {
    for (const namespace of Object.keys(formulas)) {
      (formulasMetadata as PackFormulasMetadata)[namespace] = formulas[namespace].map(compileFormulaMetadata);
    }
  }

  return formulasMetadata;
}

function compileFormulaMetadata(formula: TypedPackFormula): PackFormulaMetadata {
  const {execute, ...rest} = formula;
  return rest;
}

function compileSyncTable(syncTable: GenericSyncTable): PackSyncTable {
  if (isDynamicSyncTable(syncTable)) {
    const {getter, getName, getSchema, getDisplayUrl, listDynamicUrls, ...rest} = syncTable;
    const {execute, ...getterRest} = getter;
    return {
      ...rest,
      getName: compileMetadataFormulaMetadata(getName),
      getSchema: compileMetadataFormulaMetadata(getSchema),
      getDisplayUrl: compileMetadataFormulaMetadata(getDisplayUrl),
      listDynamicUrls: compileMetadataFormulaMetadata(listDynamicUrls),
      getter: getterRest,
    };
  }

  const {getter, ...rest} = syncTable;
  const {execute, ...getterRest} = getter;
  return {
    ...rest,
    getter: getterRest,
  };
}

function compileDefaultAuthenticationMetadata(
  authentication: Authentication | undefined,
): AuthenticationMetadata | undefined {
  if (!authentication) {
    return;
  }
  if (authentication.type === AuthenticationType.None) {
    return authentication;
  }
  const {getConnectionName, getConnectionUserId, postSetup, ...rest} = authentication;
  return {
    ...rest,
    getConnectionName: compileMetadataFormulaMetadata(getConnectionName),
    getConnectionUserId: compileMetadataFormulaMetadata(getConnectionUserId),
    postSetup: postSetup ? postSetup.map(compilePostSetupStepMetadata) : undefined,
  };
}

function compileMetadataFormulaMetadata(formula: MetadataFormula | undefined): MetadataFormulaMetadata | undefined {
  if (!formula) {
    return;
  }
  const {execute, ...rest} = formula;
  return rest;
}

function compilePostSetupStepMetadata(step: PostSetup): PostSetupMetadata {
  const {getOptionsFormula, ...rest} = step;
  return {
    ...rest,
    getOptionsFormula: ensureExists(compileMetadataFormulaMetadata(getOptionsFormula)),
  };
}
