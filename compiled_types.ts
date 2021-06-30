import type {Authentication} from './types';
import type {AuthenticationType} from './types';
import type {DistributiveOmit} from './type_utils';
import type {Format} from './types';
import type {MetadataFormulaMetadata} from './api';
import type {ObjectPackFormulaMetadata} from './api';
import type {PackDefinition} from './types';
import type {PackFormulaMetadata} from './api';
import type {PackVersionDefinition} from './types';
import type {PostSetup} from './types';
import type {SyncTable} from './api';

export type PackSyncTable = Omit<
  SyncTable,
  'getter' | 'getName' | 'getSchema' | 'listDynamicUrls' | 'getDisplayUrl'
> & {
  getter: PackFormulaMetadata;
  isDynamic?: boolean;
  hasDynamicSchema?: boolean;
  getSchema?: MetadataFormulaMetadata;
  getName?: MetadataFormulaMetadata;
  getDisplayUrl?: MetadataFormulaMetadata;
  listDynamicUrls?: MetadataFormulaMetadata;
};

export interface PackFormatMetadata extends Omit<Format, 'matchers'> {
  matchers: string[];
}

export interface PackFormulasMetadata {
  [namespace: string]: PackFormulaMetadata[];
}

export type PostSetupMetadata = Omit<PostSetup, 'getOptionsFormula'> & {
  getOptionsFormula: MetadataFormulaMetadata;
};

export type AuthenticationMetadata = DistributiveOmit<
  Authentication,
  'getConnectionName' | 'getConnectionUserId' | 'postSetup'
> & {
  getConnectionName?: MetadataFormulaMetadata;
  getConnectionUserId?: MetadataFormulaMetadata;
  postSetup?: PostSetupMetadata[];
};

/** Stripped-down version of `PackVersionDefinition` that doesn't contain formula definitions. */
export type PackVersionMetadata = Omit<
  PackVersionDefinition,
  'formulas' | 'formats' | 'defaultAuthentication' | 'syncTables'
> & {
  // TODO: @alan-fang once all packs are using formulaNamespace, delete PackFormulasMetadata.
  formulas: PackFormulasMetadata | PackFormulaMetadata[];
  formats: PackFormatMetadata[];
  syncTables: PackSyncTable[];
  defaultAuthentication?: AuthenticationMetadata;
};

/** Stripped-down version of `PackDefinition` that doesn't contain formula definitions. */
export type PackMetadata = PackVersionMetadata &
  Pick<
    PackDefinition,
    | 'id'
    | 'name'
    | 'shortDescription'
    | 'description'
    | 'permissionsDescription'
    | 'category'
    | 'logoPath'
    | 'exampleImages'
    | 'exampleVideoIds'
    | 'minimumFeatureSet'
    | 'quotas'
    | 'rateLimits'
    | 'enabledConfigName'
    | 'isSystem'
  >;

// Re-exported values for use in browser code.

export type ExternalPackAuthenticationType = AuthenticationType;
export type ExternalPackFormulas = PackFormulasMetadata | PackFormulaMetadata[];
export type ExternalObjectPackFormula = ObjectPackFormulaMetadata;
export type ExternalPackFormula = PackFormulaMetadata;
export type ExternalPackFormat = Format;
export type ExternalPackFormatMetadata = PackFormatMetadata;
export type ExternalSyncTable = PackSyncTable;

type BasePackVersionMetadata = Omit<
  PackVersionMetadata,
  'defaultAuthentication' | 'systemConnectionAuthentication' | 'formulas' | 'formats' | 'syncTables'
>;

/** Further stripped-down version of `PackVersionMetadata` that contains only what the browser needs. */
export interface ExternalPackVersionMetadata extends BasePackVersionMetadata {
  authentication: {
    type: ExternalPackAuthenticationType;
    params?: Array<{name: string; description: string}>;
    requiresEndpointUrl: boolean;
    endpointDomain?: string;
    postSetup?: PostSetupMetadata[];
    deferConnectionSetup?: boolean;
    shouldAutoAuthSetup?: boolean;
  };
  instructionsUrl?: string;

  // User-facing components
  formulas?: ExternalPackFormulas;
  formats?: ExternalPackFormat[];
  syncTables?: ExternalSyncTable[];
}

/** Further stripped-down version of `PackMetadata` that contains only what the browser needs. */
export type ExternalPackMetadata = ExternalPackVersionMetadata &
  Pick<
    PackMetadata,
    | 'id'
    | 'name'
    | 'shortDescription'
    | 'description'
    | 'permissionsDescription'
    | 'category'
    | 'logoPath'
    | 'exampleImages'
    | 'exampleVideoIds'
    | 'minimumFeatureSet'
    | 'quotas'
    | 'rateLimits'
    | 'isSystem'
  >;

export interface PackUpload {
  // PackMetadata is only for legacy packs. This should be removed once
  // all the feature's we're relying on from legacy pack defs like quotas
  // have been migrated or retired.
  metadata: PackVersionMetadata | PackMetadata;
  sdkVersion: string;
  bundle: string;
  sourceMap: string;
}
