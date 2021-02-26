import type {$OmitNested} from './type_utils';
import type {Authentication} from './types';
import type {AuthenticationType} from './types';
import type {Format} from './types';
import type {MetadataFormula} from './api';
import type {ObjectPackFormulaMetadata} from './api';
import type {PackDefinition} from './types';
import type {PackFormulaMetadata} from './api';
import type {PostSetup} from './types';
import type {SyncTable} from './api';

// TODO(alexd): Uncomment the getSchema stripping.
export type PackSyncTable = Omit<SyncTable, 'getter' | 'getName' /* | 'getSchema' */> & {
  getter: PackFormulaMetadata;
  isDynamic?: boolean;
  hasDynamicSchema?: boolean;
  getDisplayUrl?: MetadataFormula;
  listDynamicUrls?: MetadataFormula;
};

export interface PackFormatMetadata extends Omit<Format, 'matchers'> {
  matchers: string[];
}

export interface PackFormulasMetadata {
  [namespace: string]: PackFormulaMetadata[];
}

/** Stripped-down version of `PackDefinition` that doesn't contain formula definitions. */
export type PackMetadata = Omit<PackDefinition, 'formulas' | 'formats' | 'defaultAuthentication' | 'syncTables'> & {
  // TODO: @alan-fang once all packs are using formulaNamespace, delete PackFormulasMetadata.
  formulas: PackFormulasMetadata | PackFormulaMetadata[];
  formats: PackFormatMetadata[];
  syncTables: PackSyncTable[];
  // TODO(jonathan): Make a proper metadata type for Authentication, that removes `execute` from
  // all the metadata formulas, including the on PostSetup.
  defaultAuthentication?: $OmitNested<Authentication, 'getConnectionName', 'execute'>;
};

// Re-exported values for use in browser code.

export type ExternalPackAuthenticationType = AuthenticationType;
export type ExternalPackFormulas = PackFormulasMetadata | PackFormulaMetadata[];
export type ExternalObjectPackFormula = ObjectPackFormulaMetadata;
export type ExternalPackFormula = PackFormulaMetadata;
export type ExternalPackFormat = Format;
export type ExternalPackFormatMetadata = PackFormatMetadata;
export type ExternalSyncTable = PackSyncTable;

type BasePackMetadata = Omit<
  PackMetadata,
  | 'enabledConfigName'
  | 'defaultAuthentication'
  | 'systemConnectionAuthentication'
  | 'formulas'
  | 'formats'
  | 'syncTables'
>;

/** Further stripped-down version of `PackMetadata` that contains only what the browser needs. */
export interface ExternalPackMetadata extends BasePackMetadata {
  authentication: {
    type: ExternalPackAuthenticationType;
    params?: Array<{name: string; description: string}>;
    requiresEndpointUrl: boolean;
    endpointDomain?: string;
    postSetup?: PostSetup[];
    deferConnectionSetup?: boolean;
    shouldAutoAuthSetup?: boolean;
  };
  instructionsUrl?: string;

  // User-facing components
  formulas?: ExternalPackFormulas;
  formats?: ExternalPackFormat[];
  syncTables?: ExternalSyncTable[];
}

export interface PackUpload {
  metadata: PackMetadata;
  bundle: string;
}
