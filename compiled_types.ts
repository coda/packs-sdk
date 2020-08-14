import {$OmitNested} from './type_utils';
import {Authentication} from './types';
import {AuthenticationType} from './types';
import {Format} from './types';
import {MetadataFormula} from './api';
import {PackDefinition} from './types';
import {TypedPackFormula} from './api';
import {SyncTable} from './api';

export type PackFormulaMetadata = Omit<TypedPackFormula, 'execute'>;
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
  formulas: PackFormulasMetadata;
  formats: PackFormatMetadata[];
  syncTables: PackSyncTable[];
  defaultAuthentication?: $OmitNested<
    $OmitNested<Authentication, 'getConnectionNameFormula', 'execute'>,
    'getConnectionName',
    'execute'
  >;
};

// Re-exported values for use in browser code.

export type ExternalPackAuthenticationType = AuthenticationType;
export type ExternalPackFormulas = PackFormulasMetadata;
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
  | 'triggers'
  | 'syncTables'
>;

/** Further stripped-down version of `PackMetadata` that contains only what the browser needs. */
export interface ExternalPackMetadata extends BasePackMetadata {
  authentication: {
    type: ExternalPackAuthenticationType;
    params?: Array<{name: string; description: string}>;
    requiresEndpointUrl: boolean;
    endpointDomain?: string;
    postSetup?: Array<{
      name: string;
      description: string;
      getOptionsFormula: PackFormulaMetadata;
    }>;
    deferConnectionSetup?: boolean;
  };
  instructionsUrl?: string;

  // User-facing components
  formulas?: ExternalPackFormulas;
  formats?: ExternalPackFormat[];
  syncTables?: ExternalSyncTable[];
}
