import type {AWSAccessKeyAuthentication} from '../types';
import type {AWSAssumeRoleAuthentication} from '../types';
import type {AdminAuthentication} from '../types';
import type {AdminAuthenticationTypes} from '../types';
import {AllPrecannedDates} from '../api_types';
import type {ArraySchema} from '../schema';
import type {AssistantMessageTool} from '../types';
import {AttributionNodeType} from '../schema';
import type {AuthenticationMetadata} from '../compiled_types';
import {AuthenticationType} from '../types';
import {BooleanHintValueTypes} from '../schema';
import type {BooleanPackFormula} from '../api';
import type {BooleanSchema} from '../schema';
import type {CategorizationIndexDefinition} from '../schema';
import type {CodaApiBearerTokenAuthentication} from '../types';
import type {CodaInternalRichTextSchema} from '../schema';
import type {CommentContentCategorization} from '../schema';
import {ConnectionRequirement} from '../api_types';
import {ContentCategorizationType} from '../schema';
import {CurrencyFormat} from '../schema';
import type {CurrencySchema} from '../schema';
import type {CustomAuthentication} from '../types';
import type {CustomHeaderTokenAuthentication} from '../types';
import type {CustomIndexDefinition} from '../schema';
import type {DetailedIndexedProperty} from '../schema';
import type {DocumentContentCategorization} from '../schema';
import type {DurationSchema} from '../schema';
import {DurationUnit} from '../schema';
import type {DynamicSyncTableDef} from '../api';
import type {EmailContentCategorization} from '../schema';
import {EmailDisplayType} from '../schema';
import type {EmailSchema} from '../schema';
import {FeatureSet} from '../types';
import type {FormulaOptions} from '../api';
import type {GenericObjectSchema} from '../schema';
import type {GenericSyncFormula} from '..';
import type {GoogleDomainWideDelegationAuthentication} from '../types';
import type {GoogleServiceAccountAuthentication} from '../types';
import type {HeaderBearerTokenAuthentication} from '../types';
import type {Identity} from '../schema';
import {ImageCornerStyle} from '../schema';
import {ImageOutline} from '../schema';
import type {ImageSchema} from '..';
import {ImageShapeStyle} from '../schema';
import {IndexingStrategy} from '../schema';
import {JSONPath} from 'jsonpath-plus';
import type {KnowledgeTool} from '../types';
import {KnowledgeToolSourceType} from '../types';
import {LifecycleBehavior} from '../schema';
import {LinkDisplayType} from '../schema';
import type {LinkSchema} from '../schema';
import type {MessagingContentCategorization} from '../schema';
import type {MultiHeaderTokenAuthentication} from '../types';
import type {MultiQueryParamTokenAuthentication} from '../types';
import type {Network} from '../api_types';
import {NetworkConnection} from '../api_types';
import type {NoAuthentication} from '../types';
import type {NumericDateSchema} from '../schema';
import type {NumericDateTimeSchema} from '../schema';
import type {NumericDurationSchema} from '../schema';
import type {NumericPackFormula} from '../api';
import type {NumericSchema} from '../schema';
import type {NumericTimeSchema} from '../schema';
import type {OAuth2Authentication} from '../types';
import type {OAuth2ClientCredentialsAuthentication} from '../types';
import {ObjectHintValueTypes} from '../schema';
import type {ObjectPackFormula} from '../api';
import type {ObjectSchema} from '../schema';
import type {ObjectSchemaPathProperties} from '../schema';
import type {ObjectSchemaProperty} from '../schema';
import {OptionsType} from '../api_types';
import {PackCategory} from '../types';
import type {PackFormatMetadata} from '../compiled_types';
import type {PackFormulaMetadata} from '../api';
import type {PackTool} from '../types';
import type {PackVersionDefinition} from '..';
import type {PackVersionMetadata} from '../compiled_types';
import type {ParamDef} from '../api_types';
import type {ParamDefs} from '../api_types';
import type {ParentDefinition} from '../schema';
import {PermissionsBehavior} from '../schema';
import {PostSetupType} from '../types';
import type {PrecannedDate} from '../api_types';
import {PrecannedDateRange} from '..';
import type {ProgressBarSchema} from '../schema';
import type {PropertyIdentifier} from '../schema';
import type {QueryParamTokenAuthentication} from '../types';
import {ReservedAuthenticationNames} from '../types';
import {ScaleIconSet} from '../schema';
import type {ScaleSchema} from '../schema';
import type {Schema} from '../schema';
import type {ScreenAnnotationTool} from '../types';
import {ScreenAnnotationType} from '../types';
import type {SetEndpoint} from '../types';
import {SimpleStringHintValueTypes} from '../schema';
import type {SimpleStringSchema} from '../schema';
import type {Skill} from '../types';
import type {SkillEntrypointConfig} from '../types';
import type {SkillEntrypoints} from '../types';
import type {SliderSchema} from '../schema';
import type {StringDateSchema} from '../schema';
import type {StringDateTimeSchema} from '../schema';
import type {StringEmbedSchema} from '../schema';
import type {StringPackFormula} from '../api';
import type {StringTimeSchema} from '../schema';
import type {StringWithOptionsSchema} from '../schema';
import type {SummarizerTool} from '../types';
import type {SyncExecutionContext} from '..';
import type {SyncFormula} from '../api';
import type {SyncPassthroughData} from '../api';
import type {SyncTable} from '../api';
import type {SyncTableDef} from '../api';
import type {SystemAuthenticationTypes} from '../types';
import {TableRole} from '../api_types';
import {TokenExchangeCredentialsLocation} from '../types';
import {ToolType} from '../types';
import {Type} from '../api_types';
import URLParse from 'url-parse';
import type {UnionType} from '../api_types';
import type {ValidationError} from './types';
import {ValueHintType} from '../schema';
import {ValueType} from '../schema';
import type {VariousAuthentication} from '../types';
import type {VariousSupportedAuthenticationTypes} from '../types';
import type {WebBasicAuthentication} from '../types';
import {ZodParsedType} from 'zod';
import {assertCondition} from '../helpers/ensure';
import {ensureUnreachable} from '../helpers/ensure';
import {isArray} from '../schema';
import {isArrayType} from '../api_types';
import {isCategorizationIndexDefinition} from '../schema';
import {isDefined} from '../helpers/object_utils';
import {isNil} from '../helpers/object_utils';
import {isObject} from '../schema';
import {isSyncPackFormula} from '../api';
import {makeSchema} from '../schema';
import {maybeSchemaOptionsValue} from '../schema';
import {maybeUnwrapArraySchema} from '../schema';
import {normalizePropertyValuePathIntoSchemaPath} from '../schema';
import {objectSchemaHelper} from '../helpers/migration';
import semver from 'semver';
import {unwrappedSchemaSupportsOptions} from '../schema';
import * as z from 'zod';

/**
 * The uncompiled column format matchers will be expected to be actual regex objects,
 * and when we compile the pack / stringify it to json, we will store the .toString()
 * of those regex objects. This regex is used to hydrate the stringified regex back into
 * a real RegExp object.
 */
export const PACKS_VALID_COLUMN_FORMAT_MATCHER_REGEX = /^\/(.*)\/([a-z]+)?$/;

// The following largely copied from tokens.ts for parsing formula names.
const letterChar = String.raw`\p{L}`;
const numberChar = String.raw`\p{N}`;
const wordChar = String.raw`${letterChar}${numberChar}_`;
const regexLetterChar = String.raw`[${letterChar}]`;
const regexWordChar = String.raw`[${wordChar}]`;
const regexFormulaNameStr = String.raw`^${regexLetterChar}(?:${regexWordChar}+)?$`;
const regexFormulaName = new RegExp(regexFormulaNameStr, 'u');
// This is currently the same as the tokenizer's restrictions except stricter
// because we don't allow leading underscores.
const regexParameterName = regexFormulaName;

export const Limits = {
  BuildingBlockCountPerType: 100,
  BuildingBlockName: 50,
  BuildingBlockDescription: 1000,
  ColumnMatcherRegex: 300,
  MaxSkillCount: 15,
  NumColumnMatchersPerFormat: 10,
  NetworkDomainUrl: 253,
  PermissionsBatchSize: 5000,
  PromptLength: 10000,
  UpdateBatchSize: 1000,
  FilterableProperties: 5,
};

enum CustomErrorCode {
  NonMatchingDiscriminant = 'nonMatchingDiscriminant',
}

export class PackMetadataValidationError extends Error {
  readonly originalError: Error | undefined;
  readonly validationErrors: ValidationError[] | undefined;

  constructor(message: string, originalError?: Error, validationErrors?: ValidationError[]) {
    super(
      `${message}: ${JSON.stringify(validationErrors)}`.slice(0, 4096), // some random limit to make sure this message isn't unnecessarily long
    );
    this.originalError = originalError;
    this.validationErrors = validationErrors;
  }
}

export async function validatePackVersionMetadata(
  metadata: Record<string, any>,
  sdkVersion: string | undefined,
  {warningMode}: {warningMode?: boolean} = {},
): Promise<PackVersionMetadata> {
  const {legacyPackMetadataSchema} = buildMetadataSchema({sdkVersion, warningMode});

  let combinedSchema: z.ZodType<Partial<PackVersionMetadata>> = legacyPackMetadataSchema;

  // Server-side validation may be running a different SDK version than the pack maker
  // is using, so some breaking changes to metadata validation can be set up to only
  // take effect before or after an SDK version bump.
  if (sdkVersion) {
    for (const {versionRange, schemaExtend} of packMetadataSchemaBySdkVersion) {
      if (warningMode || semver.satisfies(sdkVersion, versionRange)) {
        combinedSchema = schemaExtend(combinedSchema);
      }
    }
  }

  // For now we use legacyPackMetadataSchema as the top-level object we validate. As soon as we migrate all of our
  // first-party pack definitions to only use versioned fields, we can use packVersionMetadataSchema  here.
  const validated = combinedSchema.safeParse(metadata);
  if (!validated.success) {
    throw new PackMetadataValidationError(
      'Pack metadata failed validation',
      validated.error,
      validated.error.errors.flatMap(zodErrorDetailToValidationError),
    );
  }

  return validated.data as PackVersionMetadata;
}

// Note: This is called within Coda for validating user-provided authentication metadata
// as part of Various connections.
export function validateVariousAuthenticationMetadata(
  auth: any,
  options: BuildMetadataSchemaArgs,
): VariousAuthentication {
  const {variousSupportedAuthenticationValidators} = buildMetadataSchema(options);
  const validated = z.union(zodUnionInput(variousSupportedAuthenticationValidators)).safeParse(auth);
  if (validated.success) {
    return auth as VariousAuthentication;
  }

  throw new PackMetadataValidationError(
    'Various authentication failed validation',
    validated.error,
    validated.error.errors.flatMap(zodErrorDetailToValidationError),
  );
}

// Note: This is called within Coda for validating the result of getSchema calls for dynamic sync tables.
export function validateSyncTableSchema(
  schema: any,
  options: BuildMetadataSchemaArgs & Required<Pick<BuildMetadataSchemaArgs, 'sdkVersion'>>,
): ArraySchema<ObjectSchema<any, any>> {
  const {arrayPropertySchema} = buildMetadataSchema(options);
  const validated = arrayPropertySchema.safeParse(schema);
  if (validated.success) {
    return validated.data;
  }
  // In case this was an ObjectSchema (describing a single row), wrap it up as an ArraySchema.
  const syntheticArraySchema = makeSchema({
    type: ValueType.Array,
    items: schema,
  });
  const validatedAsObjectSchema = arrayPropertySchema.safeParse(syntheticArraySchema);
  if (validatedAsObjectSchema.success) {
    return validatedAsObjectSchema.data;
  }

  throw new PackMetadataValidationError(
    'Schema failed validation',
    validated.error,
    validated.error.errors.flatMap(zodErrorDetailToValidationError),
  );
}

function makePropertyValidator(schema: GenericObjectSchema, context: z.RefinementCtx) {
  /**
   * Validates a PropertyIdentifier key in the object schema.
   */
  return function validateProperty(
    propertyValueRaw: PropertyIdentifier<string> | Array<PropertyIdentifier<string>> | undefined,
    fieldName: string,
    isValidSchema: (schema: Schema & ObjectSchemaProperty) => boolean,
    invalidSchemaMessage: string,
    propertyObjectPath: Array<string | number> = [fieldName],
  ) {
    function validatePropertyIdentifier(value: PropertyIdentifier, objectPath: Array<string | number>) {
      const propertyValue = typeof value === 'string' ? value : value?.property;

      let propertyValueIsPath = false;
      let propertySchema =
        typeof propertyValueRaw === 'string' && propertyValue in schema.properties
          ? schema.properties[propertyValue]
          : undefined;
      if (!propertySchema) {
        const schemaPropertyPath = normalizePropertyValuePathIntoSchemaPath(propertyValue);
        propertySchema = JSONPath({
          path: schemaPropertyPath,
          json: schema.properties,
          eval: false,
        })?.[0];
        propertyValueIsPath = true;
      }

      const propertyIdentifierDisplay = propertyValueIsPath ? `"${fieldName}" path` : `"${fieldName}" field name`;

      if (!propertySchema) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: objectPath,
          message: `The ${propertyIdentifierDisplay} "${propertyValue}" does not exist in the "properties" object.`,
        });
        return;
      }

      if (!isValidSchema(propertySchema)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: objectPath,
          message: `The ${propertyIdentifierDisplay} "${propertyValue}" ${invalidSchemaMessage}`,
        });
        return;
      }
    }

    if (propertyValueRaw) {
      if (Array.isArray(propertyValueRaw)) {
        propertyValueRaw.forEach((propertyIdentifier, i) => {
          validatePropertyIdentifier(propertyIdentifier, [...propertyObjectPath, i]);
        });
        return;
      }

      validatePropertyIdentifier(propertyValueRaw, propertyObjectPath);
    }
  };
}

/**
 * Returns a map of sync table names to their child sync table names, or undefined if the hierarchy is invalid.
 * Example valid return: { Parent: 'Child' }
 * {} is also a valid result, when there are no sync tables, or no parent relationships.
 * @hidden
 */
export function validateCrawlHierarchy(
  syncTables: SyncTable[],
  context?: z.RefinementCtx,
): Record<string, string[]> | undefined {
  const parentToChildrenMap: Record<string, string[]> = {};
  const syncTableSchemasByName: Record<string, ObjectSchema<any, any>> = {};
  for (const syncTable of syncTables) {
    syncTableSchemasByName[syncTable.name] = syncTable.schema;
  }
  for (const [tableIndex, syncTable] of syncTables.entries()) {
    let firstDiscoveredParentTable: string | undefined;
    for (const [paramIndex, param] of syncTable.getter.parameters.entries()) {
      if (!param.crawlStrategy) {
        continue;
      }
      if (param.crawlStrategy.parentTable) {
        const {tableName: parentTableName, propertyKey, inheritPermissions} = param.crawlStrategy.parentTable;

        const tableSchema = syncTableSchemasByName[parentTableName];
        if (!tableSchema) {
          context?.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['syncTables', tableIndex, 'parameters', paramIndex, 'crawlStrategy', 'parentTable'],
            message: `Sync table ${syncTable.name} expects parent table ${parentTableName} to exist.`,
          });
          return undefined;
        }

        const property = tableSchema.properties[propertyKey];
        if (!property) {
          context?.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['syncTables', tableIndex, 'parameters', paramIndex, 'crawlStrategy', 'parentTable'],
            message: `Sync table ${syncTable.name} expects parent table ${parentTableName}'s schema to have the property ${propertyKey}.`,
          });
          return undefined;
        }

        if (inheritPermissions && !(tableSchema.id === propertyKey || tableSchema.idProperty === propertyKey)) {
          context?.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['syncTables', tableIndex, 'parameters', paramIndex, 'crawlStrategy', 'parentTable'],
            message: `Sync table ${syncTable.name} expects parent table ${parentTableName}'s schema to have inheritPermissions on the id property.`,
          });
          return undefined;
        }

        // TODO(patrick): Validate the types match

        // We only allow one parent per table.
        if (firstDiscoveredParentTable && firstDiscoveredParentTable !== parentTableName) {
          context?.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['syncTables', tableIndex, 'parameters'],
            message: `Sync table ${syncTable.name} cannot reference multiple parent tables.`,
          });
          return undefined;
        }

        const childList = parentToChildrenMap[parentTableName] || [];
        // This table may already be in the child list if it uses multiple params from the parent.
        if (!childList.includes(syncTable.name)) {
          childList.push(syncTable.name);
        }
        parentToChildrenMap[parentTableName] = childList;
        firstDiscoveredParentTable = parentTableName;
      }
    }
  }
  // Verify that there's no cycle
  if (_hasCycle(parentToChildrenMap)) {
    context?.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['syncTables'],
      message: `Sync table parent hierarchy is cyclic`,
    });
    return undefined;
  }
  return parentToChildrenMap;
}

export function validateParents(syncTables: SyncTable[], context: z.RefinementCtx) {
  const syncTableSchemasByName: Record<string, ObjectSchema<any, any>> = {};
  for (const syncTable of syncTables) {
    syncTableSchemasByName[syncTable.identityName] = syncTable.schema;
  }

  for (const [tableIndex, syncTable] of syncTables.entries()) {
    const parentDefinition = syncTable.schema.parent as ParentDefinition | undefined;
    if (!parentDefinition) {
      continue;
    }

    const propertyValidator = makePropertyValidator(syncTable.schema, context);
    propertyValidator(
      parentDefinition.parentIdProperty,
      'parentIdProperty',
      parentIdPropertySchema =>
        Boolean(
          parentIdPropertySchema.type === ValueType.Object &&
            parentIdPropertySchema.codaType === ValueHintType.Reference &&
            parentIdPropertySchema.identity?.name &&
            syncTableSchemasByName[parentIdPropertySchema.identity.name],
        ),
      `must reference a property with a valid identity in the pack.`,
      ['syncTables', tableIndex, 'schema', 'parent', 'parentIdProperty'],
    );
  }
}

// Exported for tests
/** @hidden */
export function _hasCycle(tree: Record<string, string[]>): boolean {
  function subtreeHasCycle(currentKey: string, children: string[], visited: Set<string>): boolean {
    if (visited.has(currentKey)) {
      return true;
    }
    visited.add(currentKey);
    for (const child of children) {
      const subtree = tree[child];
      if (!subtree) {
        break;
      }
      if (subtreeHasCycle(child, subtree, visited)) {
        return true;
      }
    }
    visited.delete(currentKey);
    return false;
  }
  return subtreeHasCycle('__CODA_INTERNAL_ROOT__', Object.keys(tree), new Set<string>());
}

function getNonUniqueElements<T extends string>(items: T[]): T[] {
  const set = new Set<string>();
  const nonUnique: T[] = [];
  for (const item of items) {
    // make this case insensitive
    const normalized = item.toUpperCase();
    if (set.has(normalized)) {
      nonUnique.push(item);
    }
    set.add(normalized);
  }
  return nonUnique;
}

export function zodErrorDetailToValidationError(subError: z.ZodIssue): ValidationError[] {
  // Top-level errors for union types are totally useless, they just say "invalid input",
  // but they do record all of the specific errors when trying each element of the union,
  // so we filter out the errors that were just due to non-matches of the discriminant
  // and bubble up the rest to the top level, we get actionable output.
  if (subError.code === z.ZodIssueCode.invalid_union) {
    const underlyingErrors: ValidationError[] = [];
    for (const unionError of subError.unionErrors) {
      const isNonmatchedUnionMember = unionError.issues.some(issue => {
        return (
          issue.code === z.ZodIssueCode.custom &&
          issue.params?.customErrorCode === CustomErrorCode.NonMatchingDiscriminant
        );
      });
      // Skip any errors that are nested with an "invalid literal" error that is usually
      // a failed discriminant match; we don't care about reporting any errors from this union
      // member if the discriminant didn't match.
      if (isNonmatchedUnionMember) {
        continue;
      }
      for (const unionIssue of unionError.issues) {
        const isDiscriminantError =
          unionIssue.code === z.ZodIssueCode.custom &&
          unionIssue.params?.customErrorCode === CustomErrorCode.NonMatchingDiscriminant;
        if (!isDiscriminantError) {
          let errors: ValidationError[];
          if (unionIssue.code === z.ZodIssueCode.invalid_union) {
            // Recurse to find the real error underlying any unions within child fields.
            errors = zodErrorDetailToValidationError(unionIssue);
          } else {
            const error: ValidationError = {
              path: zodPathToPathString(unionIssue.path),
              message: unionIssue.message,
            };
            errors = [error];
          }
          // dedupe identical errors. These can occur when validating union types, and each union type
          // throws the same validation error.
          for (const error of errors) {
            if (!underlyingErrors.find(err => err.path === error.path && err.message === error.message)) {
              underlyingErrors.push(error);
            }
          }
        }
      }
    }

    if (underlyingErrors.length === 0) {
      return [{path: zodPathToPathString(subError.path), message: 'Could not find any valid schema for this value.'}];
    }

    return underlyingErrors;
  }

  const {path: zodPath, message} = subError;
  const path = zodPathToPathString(zodPath);
  const isMissingRequiredFieldError =
    subError.code === z.ZodIssueCode.invalid_type &&
    subError.received === 'undefined' &&
    subError.expected.toString() !== 'undefined';

  return [
    {
      path,
      message: isMissingRequiredFieldError ? `Missing required field ${path}.` : message,
    },
  ];
}

function zodPathToPathString(zodPath: Array<string | number>): string {
  const parts: string[] = [];
  zodPath.forEach((zodPathPart, i) => {
    const part = typeof zodPathPart === 'number' ? `[${zodPathPart}]` : zodPathPart;
    const includeSeparator = i !== zodPath.length - 1 && !(typeof zodPath[i + 1] === 'number');
    parts.push(part);
    if (includeSeparator) {
      parts.push('.');
    }
  });
  return parts.join('');
}

type ZodCompleteShape<T> = {
  [k in keyof T]: z.ZodTypeAny;
};

function zodCompleteObject<O, T extends ZodCompleteShape<O> = ZodCompleteShape<Required<O>>>(shape: T) {
  return z.object<T>(shape);
}

function zodCompleteStrictObject<O, T extends ZodCompleteShape<O> = ZodCompleteShape<Required<O>>>(shape: T) {
  return z.strictObject<T>(shape);
}

function zodDiscriminant(value: string | number | boolean) {
  return z.union([z.string(), z.number(), z.boolean(), z.undefined()]).superRefine((data, context) => {
    if (data !== value) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Non-matching discriminant',
        params: {customErrorCode: CustomErrorCode.NonMatchingDiscriminant},
        fatal: true,
      });
    }
  });
}

type ZodUnionInput = [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]];

function zodUnionInput(schemas: z.ZodTypeAny[]): ZodUnionInput {
  assertCondition(schemas.length >= 2, 'A zod union type requires at least 2 options.');
  return schemas as ZodUnionInput;
}

const setEndpointPostSetupValidator = zodCompleteObject<SetEndpoint>({
  type: zodDiscriminant(PostSetupType.SetEndpoint),
  name: z.string(),
  description: z.string(),
  // TODO(jonathan): Remove this from the metadata object, only needs to be present in the full bundle.
  getOptions: z.unknown().optional(),
  getOptionsFormula: z.unknown().optional(),
}).refine(
  data => data.getOptions || data.getOptionsFormula,
  'Either getOptions or getOptionsFormula must be specified.',
);

interface BuildMetadataSchemaArgs {
  sdkVersion?: string;
  warningMode?: boolean;
}

function buildMetadataSchema({sdkVersion}: BuildMetadataSchemaArgs): {
  legacyPackMetadataSchema: z.ZodType<Partial<PackVersionMetadata>>;
  variousSupportedAuthenticationValidators: z.ZodTypeAny[];
  arrayPropertySchema: z.ZodTypeAny;
} {
  const singleAuthDomainSchema = z
    .string()
    .nonempty()
    .refine(domain => domain.indexOf(' ') < 0, {
      message:
        'The `networkDomain` in setUserAuthentication() cannot contain spaces. Use an array for multiple domains.',
    });

  const baseAuthenticationValidators = {
    // TODO(jonathan): Remove these after fixing/exporting types for Authentication metadata, as they're only present
    // in the full bundle, not the metadata.
    getConnectionName: z.unknown().optional(),
    getConnectionUserId: z.unknown().optional(),
    instructionsUrl: z.string().optional(),
    requiresEndpointUrl: z.boolean().optional(),
    endpointDomain: z.string().optional(),
    // The items are technically a discriminated union type but that union currently only has one member.
    postSetup: z.array(setEndpointPostSetupValidator).optional(),
    networkDomain: z.union([singleAuthDomainSchema, z.array(singleAuthDomainSchema).nonempty()]).optional(),
  };

  const defaultAuthenticationValidators: Record<AuthenticationType, z.ZodTypeAny> = {
    [AuthenticationType.None]: zodCompleteStrictObject<NoAuthentication>({
      type: zodDiscriminant(AuthenticationType.None),
    }),
    [AuthenticationType.HeaderBearerToken]: zodCompleteStrictObject<HeaderBearerTokenAuthentication>({
      type: zodDiscriminant(AuthenticationType.HeaderBearerToken),
      ...baseAuthenticationValidators,
    }),
    [AuthenticationType.CodaApiHeaderBearerToken]: zodCompleteStrictObject<CodaApiBearerTokenAuthentication>({
      type: zodDiscriminant(AuthenticationType.CodaApiHeaderBearerToken),
      deferConnectionSetup: z.boolean().optional(),
      shouldAutoAuthSetup: z.boolean().optional(),
      ...baseAuthenticationValidators,
    }),
    [AuthenticationType.CustomHeaderToken]: zodCompleteStrictObject<CustomHeaderTokenAuthentication>({
      type: zodDiscriminant(AuthenticationType.CustomHeaderToken),
      headerName: z.string(),
      tokenPrefix: z.string().optional(),
      ...baseAuthenticationValidators,
    }),
    [AuthenticationType.MultiHeaderToken]: zodCompleteStrictObject<MultiHeaderTokenAuthentication>({
      type: zodDiscriminant(AuthenticationType.MultiHeaderToken),
      headers: z
        .array(
          zodCompleteStrictObject<MultiHeaderTokenAuthentication['headers'][number]>({
            name: z.string(),
            description: z.string(),
            tokenPrefix: z.string().optional(),
          }),
        )
        .refine(
          headers => {
            const keys = headers.map(header => header.name.toLowerCase());
            return keys.length === new Set(keys).size;
          },
          {message: 'Duplicated header names in the MultiHeaderToken authentication config'},
        ),
      ...baseAuthenticationValidators,
    }),
    [AuthenticationType.QueryParamToken]: zodCompleteStrictObject<QueryParamTokenAuthentication>({
      type: zodDiscriminant(AuthenticationType.QueryParamToken),
      paramName: z.string(),
      ...baseAuthenticationValidators,
    }),
    [AuthenticationType.MultiQueryParamToken]: zodCompleteStrictObject<MultiQueryParamTokenAuthentication>({
      type: zodDiscriminant(AuthenticationType.MultiQueryParamToken),
      params: z
        .array(
          zodCompleteStrictObject<MultiQueryParamTokenAuthentication['params'][number]>({
            name: z.string(),
            description: z.string(),
          }),
        )
        .refine(
          params => {
            const keys = params.map(param => param.name);
            return keys.length === new Set(keys).size;
          },
          {message: 'Duplicated parameter names in the MultiQueryParamToken authentication config'},
        ),
      ...baseAuthenticationValidators,
    }),
    [AuthenticationType.OAuth2]: zodCompleteStrictObject<OAuth2Authentication>({
      type: zodDiscriminant(AuthenticationType.OAuth2),
      /** Accepts relative URLs when requiresEndpointUrl is true. */
      authorizationUrl: z.string().refine(validateUrlParsesIfAbsolute),
      /** Accepts relative URLs when requiresEndpointUrl is true. */
      tokenUrl: z.string().refine(validateUrlParsesIfAbsolute),
      scopes: z.array(z.string()).optional(),
      scopeDelimiter: z.enum([' ', ',', ';']).optional(),
      tokenPrefix: z.string().optional(),
      additionalParams: z.record(z.any()).optional(),
      endpointKey: z.string().optional(),
      tokenQueryParam: z.string().optional(),
      useProofKeyForCodeExchange: z.boolean().optional(),
      pkceChallengeMethod: z.enum(['plain', 'S256']).optional(),
      scopeParamName: z.string().optional(),
      nestedResponseKey: z.string().optional(),
      credentialsLocation: z.nativeEnum(TokenExchangeCredentialsLocation).optional(),
      ...baseAuthenticationValidators,
    }).superRefine(({requiresEndpointUrl, endpointKey, authorizationUrl, tokenUrl}, context) => {
      const expectsRelativeUrl = requiresEndpointUrl && !endpointKey;
      const isRelativeUrl = (url: string) => url.startsWith('/');
      const addIssue = (property: string) => {
        const expectedType = expectsRelativeUrl ? 'a relative' : 'an absolute';
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [property],
          message: `${property} must be ${expectedType} URL when \
${endpointKey ? 'endpointKey is set' : `requiresEndpointUrl is ${requiresEndpointUrl ?? 'not true'}`}`,
        });
      };

      if (
        (expectsRelativeUrl && !isRelativeUrl(authorizationUrl)) ||
        (!expectsRelativeUrl && !isAbsoluteUrl(authorizationUrl))
      ) {
        addIssue('authorizationUrl');
      }
      if ((expectsRelativeUrl && !isRelativeUrl(tokenUrl)) || (!expectsRelativeUrl && !isAbsoluteUrl(tokenUrl))) {
        addIssue('tokenUrl');
      }
    }),
    [AuthenticationType.OAuth2ClientCredentials]: zodCompleteStrictObject<OAuth2ClientCredentialsAuthentication>({
      type: zodDiscriminant(AuthenticationType.OAuth2ClientCredentials),
      tokenUrl: z.string().url().refine(validateUrlParsesIfAbsolute),
      scopes: z.array(z.string()).optional(),
      scopeDelimiter: z.enum([' ', ',', ';']).optional(),
      tokenPrefix: z.string().optional(),
      tokenQueryParam: z.string().optional(),
      scopeParamName: z.string().optional(),
      nestedResponseKey: z.string().optional(),
      credentialsLocation: z.nativeEnum(TokenExchangeCredentialsLocation).optional(),
      ...baseAuthenticationValidators,
    }),
    [AuthenticationType.WebBasic]: zodCompleteStrictObject<WebBasicAuthentication>({
      type: zodDiscriminant(AuthenticationType.WebBasic),
      uxConfig: zodCompleteStrictObject<WebBasicAuthentication['uxConfig']>({
        placeholderUsername: z.string().optional(),
        placeholderPassword: z.string().optional(),
        usernameOnly: z.boolean().optional(),
      }).optional(),
      ...baseAuthenticationValidators,
    }),
    [AuthenticationType.AWSAccessKey]: zodCompleteStrictObject<AWSAccessKeyAuthentication>({
      type: zodDiscriminant(AuthenticationType.AWSAccessKey),
      service: z.string(),
      ...baseAuthenticationValidators,
    }),
    [AuthenticationType.AWSAssumeRole]: zodCompleteStrictObject<AWSAssumeRoleAuthentication>({
      type: zodDiscriminant(AuthenticationType.AWSAssumeRole),
      service: z.string(),
      ...baseAuthenticationValidators,
    }),
    [AuthenticationType.Custom]: zodCompleteStrictObject<CustomAuthentication>({
      type: zodDiscriminant(AuthenticationType.Custom),
      params: z
        .array(
          zodCompleteStrictObject<CustomAuthentication['params'][number]>({
            name: z.string(),
            description: z.string(),
          }),
        )
        .refine(
          params => {
            const keys = params.map(param => param.name);
            return keys.length === new Set(keys).size;
          },
          {message: 'Duplicated parameter names in the mutli-query-token authentication config'},
        ),
      ...baseAuthenticationValidators,
    }),
    [AuthenticationType.GoogleDomainWideDelegation]: zodCompleteStrictObject<GoogleDomainWideDelegationAuthentication>({
      type: zodDiscriminant(AuthenticationType.GoogleDomainWideDelegation),
      scopes: z.array(z.string()).nonempty(),
      ...baseAuthenticationValidators,
    }),
    [AuthenticationType.GoogleServiceAccount]: zodCompleteStrictObject<GoogleServiceAccountAuthentication>({
      type: zodDiscriminant(AuthenticationType.GoogleServiceAccount),
      scopes: z.array(z.string()).nonempty(),
      ...baseAuthenticationValidators,
    }),
    [AuthenticationType.Various]: zodCompleteStrictObject<VariousAuthentication>({
      type: zodDiscriminant(AuthenticationType.Various),
    }),
  };

  const systemAuthenticationTypes: {[key in SystemAuthenticationTypes]: true} = {
    [AuthenticationType.HeaderBearerToken]: true,
    [AuthenticationType.CustomHeaderToken]: true,
    [AuthenticationType.MultiHeaderToken]: true,
    [AuthenticationType.MultiQueryParamToken]: true,
    [AuthenticationType.QueryParamToken]: true,
    [AuthenticationType.WebBasic]: true,
    [AuthenticationType.AWSAccessKey]: true,
    [AuthenticationType.AWSAssumeRole]: true,
    [AuthenticationType.Custom]: true,
    [AuthenticationType.OAuth2ClientCredentials]: true,
    [AuthenticationType.GoogleServiceAccount]: true,
  };

  const systemAuthenticationValidators = Object.entries(defaultAuthenticationValidators)
    .filter(([authType]) => authType in systemAuthenticationTypes)
    .map(([_authType, schema]) => schema);

  const adminAuthenticationTypes: {[key in AdminAuthenticationTypes]: true} = {
    [AuthenticationType.AWSAccessKey]: true,
    [AuthenticationType.AWSAssumeRole]: true,
    [AuthenticationType.CodaApiHeaderBearerToken]: true,
    [AuthenticationType.Custom]: true,
    [AuthenticationType.CustomHeaderToken]: true,
    [AuthenticationType.GoogleServiceAccount]: true,
    [AuthenticationType.GoogleDomainWideDelegation]: true,
    [AuthenticationType.HeaderBearerToken]: true,
    [AuthenticationType.MultiHeaderToken]: true,
    [AuthenticationType.MultiQueryParamToken]: true,
    [AuthenticationType.OAuth2]: true,
    [AuthenticationType.OAuth2ClientCredentials]: true,
    [AuthenticationType.QueryParamToken]: true,
    [AuthenticationType.WebBasic]: true,
  };

  const adminAuthenticationValidators = Object.entries(defaultAuthenticationValidators)
    .filter(([authType]) => authType in adminAuthenticationTypes)
    .map(([_authType, schema]) => schema);

  const variousSupportedAuthenticationTypes: {[key in VariousSupportedAuthenticationTypes]: true} = {
    [AuthenticationType.HeaderBearerToken]: true,
    [AuthenticationType.CustomHeaderToken]: true,
    [AuthenticationType.MultiHeaderToken]: true,
    [AuthenticationType.MultiQueryParamToken]: true,
    [AuthenticationType.QueryParamToken]: true,
    [AuthenticationType.WebBasic]: true,
    [AuthenticationType.None]: true,
  };

  const variousSupportedAuthenticationValidators = Object.entries(defaultAuthenticationValidators)
    .filter(([authType]) => authType in variousSupportedAuthenticationTypes)
    .map(([_authType, schema]) => schema);

  const reservedAuthenticationNames = Object.values(ReservedAuthenticationNames).map(value => value.toString());
  const adminAuthenticationValidator = zodCompleteObject<AdminAuthentication>({
    authentication: z.union(zodUnionInput(Object.values(adminAuthenticationValidators))),
    name: z
      .string()
      .min(1)
      .max(Limits.BuildingBlockName)
      .regex(regexParameterName, 'Authentication names can only contain alphanumeric characters and underscores.')
      .refine(name => !reservedAuthenticationNames.includes(name), {
        message: 'Authentication names must not be one of the reserved authentication names.',
      }),
    displayName: z.string().min(1).max(Limits.BuildingBlockName),
    description: z.string().min(1).max(Limits.BuildingBlockDescription),
  });

  const primitiveUnion = z.union([z.number(), z.string(), z.boolean(), z.date()]);

  const paramDefValidator = zodCompleteObject<ParamDef<any>>({
    name: z
      .string()
      .max(Limits.BuildingBlockName)
      .regex(regexParameterName, 'Parameter names can only contain alphanumeric characters and underscores.'),
    type: z
      .union([
        z.nativeEnum(Type),
        z.object({
          type: zodDiscriminant('array'),
          items: z.nativeEnum(Type),
          allowEmpty: z.boolean().optional(),
        }),
      ])
      .refine(
        paramType =>
          paramType !== Type.object &&
          !(typeof paramType === 'object' && paramType.type === 'array' && paramType.items === Type.object),
        {
          message: 'Object parameters are not currently supported.',
        },
      ),
    description: z.string().max(Limits.BuildingBlockDescription),
    instructions: z.string().optional(),
    optional: z.boolean().optional(),
    autocomplete: z.unknown().optional(),
    defaultValue: z.unknown().optional(),
    suggestedValue: z.unknown().optional(),
    ingestionSuggestedValue: z.unknown().optional(),
    fullSyncSuggestedValue: z.unknown().optional(),
    allowedPresetValues: z.array(z.unknown()).optional(),
    allowManualInput: z.boolean().optional(),
    crawlStrategy: z.unknown().optional(),
    supportsIncrementalSync: z.boolean().optional(),
  })
    .refine(
      param => {
        return param.optional || param.supportsIncrementalSync !== false;
      },
      {message: 'Required params should support incremental sync.'},
    )
    .refine(
      param => {
        if (!param.allowedPresetValues) {
          return true;
        }
        return param.type === Type.date || (isArrayType(param.type) && param.type.items === Type.date);
      },
      {message: 'allowedPresetValues is not allowed on parameters of this type.'},
    )
    .refine(
      param => {
        if (!param.allowedPresetValues || param.type !== Type.date) {
          return true;
        }
        return param.allowedPresetValues?.every(
          (value: unknown) => typeof value === 'string' && AllPrecannedDates.includes(value as PrecannedDate),
        );
      },
      {message: 'allowedPresetValues for a date parameter can only be a list of PrecannedDate values.'},
    )
    .refine(
      param => {
        if (!param.allowedPresetValues || !(isArrayType(param.type) && param.type.items === Type.date)) {
          return true;
        }
        const relativeDateRanges = Object.values(PrecannedDateRange);
        return param.allowedPresetValues?.every(
          (value: unknown) => typeof value === 'string' && relativeDateRanges.includes(value as PrecannedDateRange),
        );
      },
      {message: 'allowedPresetValues for a date array parameter can only be a list of PrecannedDateRange values.'},
    );

  const commonPackFormulaSchema = {
    // It would be preferable to use validateFormulaName here, but we have to exempt legacy packs with sync tables
    // whose getter names violate the validator, and those exemptions require the pack id, so this has to be
    // done as a superRefine on the top-level object that also contains the pack id.
    name: z.string().max(Limits.BuildingBlockName),
    description: z.string().max(Limits.BuildingBlockDescription),
    instructions: z.string().optional(),
    examples: z
      .array(
        z.object({
          params: z.array(
            z.union([
              primitiveUnion,
              z.array(primitiveUnion),
              z.undefined(),
              // Our TS only accepts undefined for optional params, but when an upload gets JSONified
              // and there is an undefined value in array, it gets serialized to null so we have
              // to accept it here.
              z.null(),
            ]),
          ),
          result: z.any().refine(
            result => {
              return !isNil(result);
            },
            {message: "Pack formulas can't return null or undefined."},
          ),
        }),
      )
      .optional(),
    parameters: z.array(paramDefValidator).refine(
      params => {
        let hasOptional = false;
        for (const param of params) {
          if (param.optional) {
            hasOptional = true;
          } else if (!param.optional && hasOptional) {
            return false;
          }
        }
        return true;
      },
      {message: 'All optional parameters must come after all non-optional parameters.'},
    ),
    varargParameters: z.array(paramDefValidator).optional(),
    isAction: z.boolean().optional(),
    connectionRequirement: z.nativeEnum(ConnectionRequirement).optional(),
    // TODO(jonathan): Remove after removing `network` from formula def.
    network: zodCompleteObject<Network>({
      hasSideEffect: z.boolean().optional(),
      requiresConnection: z.boolean().optional(),
      connection: z.nativeEnum(NetworkConnection).optional(),
    }).optional(),
    cacheTtlSecs: z.number().min(0).optional(),
    isExperimental: z.boolean().optional(),
    isSystem: z.boolean().optional(),
    extraOAuthScopes: z.array(z.string()).optional(),
    allowedAuthenticationNames: z.array(z.string()).optional(),
    // Has to be any to avoid circular dependency.
    validateParameters: z.any().optional(),
  };

  const booleanPackFormulaSchema = zodCompleteObject<Omit<FormulaOptions<any, BooleanPackFormula<any>>, 'execute'>>({
    ...commonPackFormulaSchema,
    resultType: zodDiscriminant(Type.boolean),
    schema: zodCompleteObject<BooleanSchema>({
      type: zodDiscriminant(ValueType.Boolean),
      codaType: z.enum([...BooleanHintValueTypes]).optional(),
      description: z.string().optional(),
    }).optional(),
  });

  // TODO(jonathan): Use zodCompleteObject on these after exporting these types.

  const textAttributionNodeSchema = z.object({
    type: zodDiscriminant(AttributionNodeType.Text),
    text: z.string(),
  });

  const linkAttributionNodeSchema = z.object({
    type: zodDiscriminant(AttributionNodeType.Link),
    anchorUrl: z.string(),
    anchorText: z.string(),
  });

  const imageAttributionNodeSchema = z.object({
    type: zodDiscriminant(AttributionNodeType.Image),
    anchorUrl: z.string(),
    imageUrl: z.string(),
  });

  function zodOptionsFieldWithValues(valueType: z.ZodTypeAny, allowDisplayNames: boolean) {
    const literalType = allowDisplayNames
      ? z.union([
          valueType,
          z.strictObject({
            display: z.string(),
            value: valueType,
          }),
        ])
      : valueType;
    return z.union([z.string(), z.array(literalType)]).optional();
  }

  const basePropertyValidators = {
    description: z.string().optional(),
    displayName: z.string().optional(),
    mutable: z.boolean().optional(),
    fixedId: z.string().optional(),
    fromKey: z.string().optional(),
    originalKey: z.string().optional(),
    required: z.boolean().optional(),
  };

  const baseStringPropertyValidators = {
    ...basePropertyValidators,
    autocomplete:
      sdkVersion && semver.satisfies(sdkVersion, '<=1.4.0')
        ? zodOptionsFieldWithValues(z.string(), true)
        : z.never().optional(),
  };

  const baseNumericPropertyValidators = {
    ...basePropertyValidators,
  };

  const booleanPropertySchema = zodCompleteStrictObject<BooleanSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.Boolean),
    codaType: z.enum([...BooleanHintValueTypes]).optional(),
    ...basePropertyValidators,
  });

  const numericPropertySchema = zodCompleteStrictObject<NumericSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.Number),
    codaType: zodDiscriminant(ValueHintType.Percent).optional(),
    precision: z.number().optional(),
    useThousandsSeparator: z.boolean().optional(),
    ...baseNumericPropertyValidators,
  });

  const scalePropertySchema = zodCompleteStrictObject<ScaleSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.Number),
    codaType: zodDiscriminant(ValueHintType.Scale),
    maximum: z.number().optional(),
    icon: z.nativeEnum(ScaleIconSet).optional(),
    ...baseNumericPropertyValidators,
  });

  const optionalStringOrNumber = z.union([z.number(), z.string()]).optional();

  const sliderPropertySchema = zodCompleteStrictObject<SliderSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.Number),
    codaType: zodDiscriminant(ValueHintType.Slider),
    maximum: optionalStringOrNumber,
    minimum: optionalStringOrNumber,
    step: optionalStringOrNumber,
    showValue: z.boolean().optional(),
    ...baseNumericPropertyValidators,
  });

  const progressBarPropertySchema = zodCompleteStrictObject<ProgressBarSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.Number),
    codaType: zodDiscriminant(ValueHintType.ProgressBar),
    maximum: optionalStringOrNumber,
    minimum: optionalStringOrNumber,
    step: optionalStringOrNumber,
    showValue: z.boolean().optional(),
    ...baseNumericPropertyValidators,
  });

  const currencyPropertySchema = zodCompleteStrictObject<CurrencySchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.Number),
    codaType: zodDiscriminant(ValueHintType.Currency),
    precision: z.number().optional(),
    currencyCode: z.string().optional(),
    format: z.nativeEnum(CurrencyFormat).optional(),
    ...baseNumericPropertyValidators,
  });

  const numericDatePropertySchema = zodCompleteStrictObject<NumericDateSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.Number),
    codaType: zodDiscriminant(ValueHintType.Date),
    format: z.string().optional(),
    ...baseNumericPropertyValidators,
  });

  const numericTimePropertySchema = zodCompleteStrictObject<NumericTimeSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.Number),
    codaType: zodDiscriminant(ValueHintType.Time),
    format: z.string().optional(),
    ...baseNumericPropertyValidators,
  });

  const numericDateTimePropertySchema = zodCompleteStrictObject<NumericDateTimeSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.Number),
    codaType: zodDiscriminant(ValueHintType.DateTime),
    dateFormat: z.string().optional(),
    timeFormat: z.string().optional(),
    ...baseNumericPropertyValidators,
  });

  const numericDurationPropertySchema = zodCompleteStrictObject<NumericDurationSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.Number),
    codaType: zodDiscriminant(ValueHintType.Duration),
    precision: z.number().optional(),
    maxUnit: z.nativeEnum(DurationUnit).optional(),
    ...baseNumericPropertyValidators,
  });

  const numberPropertySchema = z.union([
    numericPropertySchema,
    scalePropertySchema,
    sliderPropertySchema,
    progressBarPropertySchema,
    currencyPropertySchema,
    numericDatePropertySchema,
    numericTimePropertySchema,
    numericDateTimePropertySchema,
    numericDurationPropertySchema,
  ]);

  const numericPackFormulaSchema = zodCompleteObject<Omit<FormulaOptions<any, NumericPackFormula<any>>, 'execute'>>({
    ...commonPackFormulaSchema,
    resultType: zodDiscriminant(Type.number),
    schema: numberPropertySchema.optional(),
  });

  const simpleStringPropertySchema = zodCompleteStrictObject<SimpleStringSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.String),
    codaType: z.enum([...SimpleStringHintValueTypes]).optional(),
    ...baseStringPropertyValidators,
  });

  const stringDatePropertySchema = zodCompleteStrictObject<StringDateSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.String),
    codaType: zodDiscriminant(ValueHintType.Date),
    format: z.string().optional(),
    ...baseStringPropertyValidators,
  });

  const stringTimePropertySchema = zodCompleteStrictObject<StringTimeSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.String),
    codaType: zodDiscriminant(ValueHintType.Time),
    format: z.string().optional(),
    ...baseStringPropertyValidators,
  });

  const stringDateTimePropertySchema = zodCompleteStrictObject<StringDateTimeSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.String),
    codaType: zodDiscriminant(ValueHintType.DateTime),
    dateFormat: z.string().optional(),
    timeFormat: z.string().optional(),
    ...baseStringPropertyValidators,
  });

  const durationPropertySchema = zodCompleteStrictObject<DurationSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.String),
    codaType: zodDiscriminant(ValueHintType.Duration),
    precision: z.number().optional(),
    maxUnit: z.nativeEnum(DurationUnit).optional(),
    ...baseStringPropertyValidators,
  });

  const codaInternalRichTextSchema = zodCompleteStrictObject<CodaInternalRichTextSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.String),
    codaType: zodDiscriminant(ValueHintType.CodaInternalRichText),
    isCanvas: z.boolean().optional(),
    ...baseStringPropertyValidators,
  });

  const embedPropertySchema = zodCompleteStrictObject<StringEmbedSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.String),
    codaType: zodDiscriminant(ValueHintType.Embed),
    force: z.boolean().optional(),
    ...baseStringPropertyValidators,
  });

  const emailPropertySchema = zodCompleteStrictObject<EmailSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.String),
    codaType: zodDiscriminant(ValueHintType.Email),
    display: z.nativeEnum(EmailDisplayType).optional(),
    ...baseStringPropertyValidators,
  });

  const linkPropertySchema = zodCompleteStrictObject<LinkSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.String),
    codaType: zodDiscriminant(ValueHintType.Url),
    display: z.nativeEnum(LinkDisplayType).optional(),
    force: z.boolean().optional(),
    ...baseStringPropertyValidators,
  });

  const stringWithOptionsPropertySchema = zodCompleteStrictObject<
    StringWithOptionsSchema & ObjectSchemaProperty & {autocomplete: any}
  >({
    type: zodDiscriminant(ValueType.String),
    codaType: zodDiscriminant(ValueHintType.SelectList),
    ...baseStringPropertyValidators,
    options: zodOptionsFieldWithValues(z.string(), true),
    allowNewValues: z.boolean().optional(),
    requireForUpdates: z.boolean().optional(),
  });

  const imagePropertySchema = zodCompleteStrictObject<ImageSchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.String),
    codaType: z.union([zodDiscriminant(ValueHintType.ImageAttachment), zodDiscriminant(ValueHintType.ImageReference)]),
    imageOutline: z.nativeEnum(ImageOutline).optional(),
    imageCornerStyle: z.nativeEnum(ImageCornerStyle).optional(),
    imageShapeStyle: z.nativeEnum(ImageShapeStyle).optional(),
    height: z.union([z.string(), z.number()]).optional(),
    width: z.union([z.string(), z.number()]).optional(),
    ...baseStringPropertyValidators,
  });

  const stringPropertySchema = z.union([
    simpleStringPropertySchema,
    stringDatePropertySchema,
    stringTimePropertySchema,
    stringDateTimePropertySchema,
    codaInternalRichTextSchema,
    durationPropertySchema,
    embedPropertySchema,
    emailPropertySchema,
    linkPropertySchema,
    imagePropertySchema,
    stringWithOptionsPropertySchema,
  ]);

  const stringPackFormulaSchema = zodCompleteObject<Omit<FormulaOptions<any, StringPackFormula<any>>, 'execute'>>({
    ...commonPackFormulaSchema,
    resultType: zodDiscriminant(Type.string),
    schema: stringPropertySchema.optional(),
  });

  // TODO(jonathan): Give this a better type than ZodTypeAny after figuring out
  // recursive typing better.
  const arrayPropertySchema: z.ZodTypeAny = z.lazy(() =>
    zodCompleteStrictObject<ArraySchema & ObjectSchemaProperty>({
      type: zodDiscriminant(ValueType.Array),
      items: objectPropertyUnionSchema,
      ...basePropertyValidators,
    }),
  );

  const ValidCodaObjectIdRegex = /^[A-Za-z0-9_-]+$/;
  // This is ripped off from isValidObjectId in coda. Violating this causes a number of downstream headaches.
  function isValidObjectId(component: string): boolean {
    return ValidCodaObjectIdRegex.test(component);
  }

  const SystemColumnNames = ['id', 'value', 'synced', 'connection'];

  enum ExemptionType {
    IdentityName = 'IdentityName',
    SyncTableGetterName = 'SyncTableGetterName',
    FilterablePropertyLimit = 'FilterablePropertyLimit',
  }

  type Exemption = [number, string, ExemptionType];

  const Exemptions: Exemption[] = [
    [1013, 'Pull Request', ExemptionType.IdentityName],
    [1021, 'Doc Analytics', ExemptionType.IdentityName],
    [1060, 'Candidate Stage', ExemptionType.IdentityName],
    [1075, 'G Suite Directory User', ExemptionType.IdentityName],
    [1079, 'Campaign Group', ExemptionType.IdentityName],
    [1083, 'Merge Request', ExemptionType.IdentityName],

    [1013, 'Sync commit history', ExemptionType.SyncTableGetterName],
    [1013, 'Sync issues', ExemptionType.SyncTableGetterName],
    [1013, 'Sync pull requests', ExemptionType.SyncTableGetterName],
    [1013, 'Sync repos', ExemptionType.SyncTableGetterName],
    [1052, 'Issue', ExemptionType.FilterablePropertyLimit],
    [1054, 'Sync table', ExemptionType.SyncTableGetterName],
    [1062, 'Form responses', ExemptionType.SyncTableGetterName],
    [1062, 'Sync forms', ExemptionType.SyncTableGetterName],
    [1078, 'Ad Creatives', ExemptionType.SyncTableGetterName],
    [1078, 'Ad Sets', ExemptionType.SyncTableGetterName],
    [1078, 'Custom Audiences', ExemptionType.SyncTableGetterName],
    [1078, 'Page Posts', ExemptionType.SyncTableGetterName],
    [1083, 'Sync commits', ExemptionType.SyncTableGetterName],
    [1083, 'Sync issues', ExemptionType.SyncTableGetterName],
    [1083, 'Sync merge requests', ExemptionType.SyncTableGetterName],
    [1083, 'Sync projects', ExemptionType.SyncTableGetterName],
    [1084, 'Ad Groups', ExemptionType.SyncTableGetterName],
    [1093, 'Sync table', ExemptionType.SyncTableGetterName],
  ];

  function exemptionKey(packId: number, entityName: string): string {
    return `${packId}/${entityName}`;
  }

  const IdentityNameExemptions = new Set(
    Exemptions.filter(([_packId, _name, exemptionType]) => exemptionType === ExemptionType.IdentityName).map(
      ([packId, name]) => exemptionKey(packId, name),
    ),
  );

  const SyncTableGetterNameExemptions = new Set(
    Exemptions.filter(([_packId, _name, exemptionType]) => exemptionType === ExemptionType.SyncTableGetterName).map(
      ([packId, name]) => exemptionKey(packId, name),
    ),
  );

  function isValidIdentityName(packId: number | undefined, name: string): boolean {
    if (packId && IdentityNameExemptions.has(exemptionKey(packId, name))) {
      return true;
    }
    if (packId === 1090) {
      // SalesForce pack has a large number of dynamic identity ids that include empty spaces.
      return true;
    }
    return isValidObjectId(name);
  }

  function isValidUseOfCodaInternalRichText(packId: number | undefined): boolean {
    // CrossDoc pack is allowed to use this type hint.
    return packId === 1054;
  }

  const attributionSchema = z
    .array(z.union([textAttributionNodeSchema, linkAttributionNodeSchema, imageAttributionNodeSchema]))
    .optional();

  const propertySchema = z.union([
    z.string().min(1),
    zodCompleteStrictObject<PropertyIdentifier>({
      property: z.string().min(1),
      label: z.string().optional(),
      placeholder: z.string().optional(),
    }),
  ]);

  const contentCategorizationSchema = z
    .discriminatedUnion('type', [
      zodCompleteStrictObject<MessagingContentCategorization>({
        type: z.literal(ContentCategorizationType.Messaging),
      }),
      zodCompleteStrictObject<DocumentContentCategorization>({
        type: z.literal(ContentCategorizationType.Document),
      }),
      zodCompleteStrictObject<EmailContentCategorization>({
        type: z.literal(ContentCategorizationType.Email),
        toProperty: propertySchema,
        fromProperty: propertySchema,
        subjectProperty: propertySchema,
        htmlBodyProperty: propertySchema,
        plainTextBodyProperty: propertySchema,
      }),
      zodCompleteStrictObject<CommentContentCategorization>({
        type: z.literal(ContentCategorizationType.Comment),
      }),
    ])
    .refine(
      data => {
        return data.type && Object.values(ContentCategorizationType).includes(data.type);
      },
      {
        message: `must be a valid content categorization type.`,
        path: ['contentCategorization', 'type'],
      },
    );

  const contextPropertiesSchema = z.array(propertySchema).min(1);

  const indexedPropertySchema = z.union([
    propertySchema,
    zodCompleteStrictObject<DetailedIndexedProperty>({
      property: propertySchema,
      strategy: z.nativeEnum(IndexingStrategy),
    }),
  ]);

  const filterablePropertiesSchema = z.array(propertySchema);

  const customIndexSchema = zodCompleteStrictObject<CustomIndexDefinition>({
    properties: z.array(indexedPropertySchema).min(1),
    contextProperties: contextPropertiesSchema.optional(),
    authorityNormProperty: propertySchema.optional(),
    popularityNormProperty: propertySchema.optional(),
    filterableProperties: filterablePropertiesSchema.optional(),
  });

  const categorizationIndexSchema = zodCompleteStrictObject<CategorizationIndexDefinition>({
    contentCategorization: contentCategorizationSchema,
    authorityNormProperty: propertySchema.optional(),
    popularityNormProperty: propertySchema.optional(),
    filterableProperties: filterablePropertiesSchema.optional(),
  });

  const indexSchema = z.union([customIndexSchema, categorizationIndexSchema]);

  const identitySchema = zodCompleteObject<Identity>({
    packId: z.number().optional(),
    name: z.string().nonempty(),
    dynamicUrl: z.string().optional(),
    attribution: attributionSchema,
    mergeKey: z.string().optional(),
  });

  const parentSchema = zodCompleteStrictObject<ParentDefinition>({
    parentIdProperty: propertySchema,
    lifecycle: z.nativeEnum(LifecycleBehavior).optional(),
    permissions: z.nativeEnum(PermissionsBehavior).optional(),
  });

  const genericObjectSchema: z.ZodTypeAny = z.lazy(() =>
    zodCompleteObject<ObjectSchema<any, any> & {autocomplete: any}>({
      ...basePropertyValidators,
      type: zodDiscriminant(ValueType.Object),
      description: z.string().optional(),
      id: z.string().min(1).optional(),
      idProperty: z.string().min(1).optional(),
      primary: z.string().min(1).optional(),
      displayProperty: z.string().min(1).optional(),
      codaType: z.enum([...ObjectHintValueTypes]).optional(),
      featured: z.array(z.string()).optional(),
      featuredProperties: z.array(z.string()).optional(),
      identity: identitySchema.optional(),
      attribution: attributionSchema,
      properties: z.record(objectPropertyUnionSchema),
      includeUnknownProperties: z.boolean().optional(),
      __packId: z.number().optional(),
      titleProperty: propertySchema.optional(),
      linkProperty: propertySchema.optional(),
      subtitleProperties: z.array(propertySchema).optional(),
      snippetProperty: propertySchema.optional(),
      imageProperty: propertySchema.optional(),
      createdAtProperty: propertySchema.optional(),
      modifiedAtProperty: propertySchema.optional(),
      createdByProperty: propertySchema.optional(),
      modifiedByProperty: propertySchema.optional(),
      userIdProperty: propertySchema.optional(),
      userEmailProperty: propertySchema.optional(),
      groupIdProperty: propertySchema.optional(),
      memberGroupIdProperty: propertySchema.optional(),
      versionProperty: propertySchema.optional(),
      options: zodOptionsFieldWithValues(z.object({}).passthrough(), false),
      requireForUpdates: z.boolean().optional(),
      index: indexSchema.optional(),
      parent: parentSchema.optional(),
      autocomplete:
        sdkVersion && semver.satisfies(sdkVersion, '<=1.4.0')
          ? zodOptionsFieldWithValues(z.string(), true)
          : z.never().optional(),
    })
      .superRefine((data, context) => {
        if (!isValidIdentityName(data.identity?.packId, data.identity?.name as string)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['identity', 'name'],
            message:
              'Invalid name. Identity names can only contain alphanumeric characters, underscores, and dashes, and no spaces.',
          });
        }
      })
      .superRefine((data, context) => {
        const schemaHelper = objectSchemaHelper(data as GenericObjectSchema);
        const fixedIds = new Set();
        for (const prop of Object.values(schemaHelper.properties)) {
          if (!prop.fixedId) {
            continue;
          }

          if (fixedIds.has(prop.fixedId)) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['properties'],
              message: `fixedIds must be unique. Found duplicate "${prop.fixedId}".`,
            });
          }
          fixedIds.add(prop.fixedId);
        }
      })
      .refine(
        data => {
          const schemaHelper = objectSchemaHelper(data as GenericObjectSchema);
          return isNil(schemaHelper.id) || schemaHelper.id in schemaHelper.properties;
        },
        {
          message: 'The "idProperty" property must appear as a key in the "properties" object.',
        },
      )
      .refine(
        data => {
          const schemaHelper = objectSchemaHelper(data as GenericObjectSchema);
          return isNil(schemaHelper.primary) || schemaHelper.primary in schemaHelper.properties;
        },
        {
          message: 'The "displayProperty" property must appear as a key in the "properties" object.',
        },
      )
      .superRefine((data, context) => {
        const schemaHelper = objectSchemaHelper(data as GenericObjectSchema);
        (schemaHelper.featured || []).forEach((f, i) => {
          if (!(f in schemaHelper.properties)) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['featured', i],
              message: `The "featuredProperties" field name "${f}" does not exist in the "properties" object.`,
            });
          }
        });
      })
      .superRefine((data, context) => {
        const schema = data as GenericObjectSchema;

        const validatePropertyValue = makePropertyValidator(schema, context);
        function validateProperty(
          fieldName: keyof ObjectSchemaPathProperties,
          isValidSchema: (schema: Schema & ObjectSchemaProperty) => boolean,
          invalidSchemaMessage: string,
        ) {
          validatePropertyValue(schema[fieldName], fieldName, isValidSchema, invalidSchemaMessage);
        }

        const validateTitleProperty = () => {
          return validateProperty(
            'titleProperty',
            propertySchema => [ValueType.String, ValueType.Object].includes(propertySchema.type),
            `must refer to a "ValueType.String" or "ValueType.Object" property.`,
          );
        };
        const validateImageProperty = () => {
          return validateProperty(
            'imageProperty',
            imagePropertySchema =>
              imagePropertySchema.type === ValueType.String &&
              [ValueHintType.ImageAttachment, ValueHintType.ImageReference].includes(
                imagePropertySchema.codaType as ValueHintType,
              ),
            `must refer to a "ValueType.String" property with a "ValueHintType.ImageAttachment" or "ValueHintType.ImageReference" "codaType".`,
          );
        };
        const validateSnippetProperty = () => {
          return validateProperty(
            'snippetProperty',
            snippetPropertySchema =>
              snippetPropertySchema.type === ValueType.String ||
              (snippetPropertySchema.type === ValueType.Array && snippetPropertySchema.items.type === ValueType.String),
            `must refer to a "ValueType.String" property or array of strings.`,
          );
        };
        const validateLinkProperty = () => {
          return validateProperty(
            'linkProperty',
            linkPropertySchema =>
              linkPropertySchema.type === ValueType.String && linkPropertySchema.codaType === ValueHintType.Url,
            `must refer to a "ValueType.String" property with a "ValueHintType.Url" "codaType".`,
          );
        };

        const validateSubtitleProperties = () => {
          return validateProperty(
            'subtitleProperties',
            subtitlePropertySchema => {
              if (!('codaType' in subtitlePropertySchema && subtitlePropertySchema.codaType)) {
                return true;
              }

              switch (subtitlePropertySchema.codaType) {
                case ValueHintType.ImageAttachment:
                case ValueHintType.Attachment:
                case ValueHintType.ImageReference:
                case ValueHintType.Embed:
                case ValueHintType.Scale:
                  return false;
                case ValueHintType.CodaInternalRichText:
                case ValueHintType.Currency:
                case ValueHintType.Date:
                case ValueHintType.DateTime:
                case ValueHintType.Duration:
                case ValueHintType.Email:
                case ValueHintType.Html:
                case ValueHintType.Markdown:
                case ValueHintType.Percent:
                case ValueHintType.Person:
                case ValueHintType.ProgressBar:
                case ValueHintType.Reference:
                case ValueHintType.SelectList:
                case ValueHintType.Slider:
                case ValueHintType.Toggle:
                case ValueHintType.Time:
                case ValueHintType.Url:
                  return true;
                default:
                  ensureUnreachable(subtitlePropertySchema.codaType);
              }
            },
            `must refer to a value that does not have a codaType corresponding to one of ImageAttachment, Attachment, ImageReference, Embed, or Scale.`,
          );
        };

        const validateCreatedAtProperty = () => {
          return validateProperty(
            'createdAtProperty',
            createdAtPropertySchema =>
              (createdAtPropertySchema.type === ValueType.String ||
                createdAtPropertySchema.type === ValueType.Number) &&
              (createdAtPropertySchema.codaType === ValueHintType.DateTime ||
                createdAtPropertySchema.codaType === ValueHintType.Date),
            `must refer to a "ValueType.String" or "ValueType.Number" property with a "ValueHintType.DateTime" or "ValueHintType.Date" "codaType".`,
          );
        };
        const validateModifiedAtProperty = () => {
          return validateProperty(
            'modifiedAtProperty',
            modifiedAtPropertySchema =>
              (modifiedAtPropertySchema.type === ValueType.String ||
                modifiedAtPropertySchema.type === ValueType.Number) &&
              (modifiedAtPropertySchema.codaType === ValueHintType.DateTime ||
                modifiedAtPropertySchema.codaType === ValueHintType.Date),
            `must refer to a "ValueType.String" or "ValueType.Number" property with a "ValueHintType.DateTime" or "ValueHintType.Date" "codaType".`,
          );
        };
        const validateCreatedByProperty = () => {
          return validateProperty(
            'createdByProperty',
            createdByPropertySchema =>
              (createdByPropertySchema.type === ValueType.Object ||
                createdByPropertySchema.type === ValueType.String) &&
              (createdByPropertySchema.codaType === ValueHintType.Person ||
                createdByPropertySchema.codaType === ValueHintType.Email),
            `must refer to a "ValueType.Object" or "ValueType.String" property with a "ValueHintType.Person" or "ValueHintType.Email" "codaType".`,
          );
        };
        const validateModifiedByProperty = () => {
          return validateProperty(
            'modifiedByProperty',
            modifiedByPropertySchema =>
              (modifiedByPropertySchema.type === ValueType.Object ||
                modifiedByPropertySchema.type === ValueType.String) &&
              (modifiedByPropertySchema.codaType === ValueHintType.Person ||
                modifiedByPropertySchema.codaType === ValueHintType.Email),
            `must refer to a "ValueType.Object" or "ValueType.String" property with a "ValueHintType.Person" or "ValueHintType.Email" "codaType".`,
          );
        };

        const validateUserEmailProperty = () => {
          return validateProperty(
            'userEmailProperty',
            userEmail =>
              (userEmail.type === ValueType.String && userEmail.codaType === ValueHintType.Email) ||
              (userEmail.type === ValueType.Object && userEmail.codaType === ValueHintType.Person),
            `must refer to a "ValueType.Object" or "ValueType.String" property with a "ValueHintType.Person" or "ValueHintType.Email" "codaType".`,
          );
        };

        const validateUserIdProperty = () => {
          return validateProperty(
            'userIdProperty',
            userIdPropertySchema =>
              userIdPropertySchema.type === ValueType.String || userIdPropertySchema.type === ValueType.Number,
            `must refer to a "ValueType.String" or "ValueType.Number".`,
          );
        };

        const validateGroupIdProperty = () => {
          return validateProperty(
            'groupIdProperty',
            groupIdPropertySchema =>
              groupIdPropertySchema.type === ValueType.String || groupIdPropertySchema.type === ValueType.Number,
            `must refer to a "ValueType.String" or "ValueType.Number".`,
          );
        };

        const validateMemberGroupIdProperty = () => {
          return validateProperty(
            'memberGroupIdProperty',
            memberGroupIdPropertySchema =>
              memberGroupIdPropertySchema.type === ValueType.String ||
              memberGroupIdPropertySchema.type === ValueType.Number,
            `must refer to a "ValueType.String" or "ValueType.Number".`,
          );
        };

        const validateVersionProperty = () => {
          return validateProperty(
            'versionProperty',
            versionPropertySchema => versionPropertySchema.type === ValueType.String,
            `must refer to a "ValueType.String" property.`,
          );
        };

        validateTitleProperty();
        validateLinkProperty();
        validateImageProperty();
        validateSnippetProperty();
        validateSubtitleProperties();
        validateCreatedAtProperty();
        validateModifiedAtProperty();
        validateCreatedByProperty();
        validateModifiedByProperty();
        validateUserEmailProperty();
        validateUserIdProperty();
        validateGroupIdProperty();
        validateMemberGroupIdProperty();
        validateVersionProperty();
      })
      .superRefine((data, context) => {
        const schemaHelper = objectSchemaHelper(data as GenericObjectSchema);
        const internalRichTextPropertyTuple = Object.entries(schemaHelper.properties).find(
          ([_key, prop]) => prop.type === ValueType.String && prop.codaType === ValueHintType.CodaInternalRichText,
        );
        if (internalRichTextPropertyTuple && !isValidUseOfCodaInternalRichText(data.identity?.packId)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['identity', 'properties', internalRichTextPropertyTuple[0]],
            message: 'Invalid codaType. CodaInternalRichText is not a supported value.',
          });
          return;
        }
      })
      .superRefine((data, context) => {
        const schema = data as GenericObjectSchema;
        if (!schema.index) {
          return;
        }

        const validatePropertyValue = makePropertyValidator(schema, context);

        const {authorityNormProperty, popularityNormProperty, filterableProperties} = schema.index;

        // validate the categorization index
        if (isCategorizationIndexDefinition(schema.index)) {
          const {contentCategorization} = schema.index;
          const {type} = contentCategorization;
          if (type === ContentCategorizationType.Email) {
            const {toProperty, fromProperty, subjectProperty, htmlBodyProperty, plainTextBodyProperty} =
              contentCategorization;
            validatePropertyValue(
              toProperty,
              'toProperty',
              property => property.type === ValueType.String,
              `must be a valid property.`,
              ['index', 'contentCategorization', 'toProperty'],
            );
            validatePropertyValue(
              fromProperty,
              'fromProperty',
              property => property.type === ValueType.String,
              `must be a valid property.`,
              ['index', 'contentCategorization', 'fromProperty'],
            );
            validatePropertyValue(
              subjectProperty,
              'subjectProperty',
              property => property.type === ValueType.String,
              `must be a valid property.`,
              ['index', 'contentCategorization', 'subjectProperty'],
            );
            validatePropertyValue(
              htmlBodyProperty,
              'htmlBodyProperty',
              property => property.type === ValueType.String,
              `must be a valid property.`,
              ['index', 'contentCategorization', 'htmlBodyProperty'],
            );
            validatePropertyValue(
              plainTextBodyProperty,
              'plainTextBodyProperty',
              property => property.type === ValueType.String,
              `must be a valid property.`,
              ['index', 'contentCategorization', 'plainTextBodyProperty'],
            );
          }
          // validate the custom index
        } else {
          const {properties, contextProperties} = schema.index;
          for (let i = 0; i < properties.length; i++) {
            const indexedProperty = properties[i];
            const objectPath = ['index', 'properties', i];
            if (typeof indexedProperty === 'string') {
              validatePropertyValue(
                indexedProperty,
                'properties',
                indexedPropertySchema =>
                  indexedPropertySchema.type === ValueType.String ||
                  (indexedPropertySchema.type === ValueType.Array &&
                    indexedPropertySchema.items.type === ValueType.String),
                `must refer to a "ValueType.String" property or a "ValueType.Array" array of "ValueType.String" properties.`,
                objectPath,
              );
            } else {
              validatePropertyValue(
                indexedProperty.property,
                'properties',
                indexedPropertySchema =>
                  indexedPropertySchema.type === ValueType.String ||
                  (indexedPropertySchema.type === ValueType.Array &&
                    indexedPropertySchema.items.type === ValueType.String),
                `must refer to a "ValueType.String" property or a "ValueType.Array" array of "ValueType.String" properties.`,
                [...objectPath, 'property'],
              );
            }
          }

          if (contextProperties) {
            validatePropertyValue(contextProperties, 'contextProperties', () => true, `must be a valid property.`, [
              'index',
              'contextProperties',
            ]);
          }
        }

        if (authorityNormProperty) {
          validatePropertyValue(
            authorityNormProperty,
            'authorityNormProperty',
            authorityNormPropertySchema => authorityNormPropertySchema.type === ValueType.Number,
            `must refer to a "ValueType.Number" property.`,
            ['index', 'authorityNormProperty'],
          );
        }

        if (popularityNormProperty) {
          validatePropertyValue(
            popularityNormProperty,
            'popularityNormProperty',
            popularityNormPropertySchema => popularityNormPropertySchema.type === ValueType.Number,
            `must refer to a "ValueType.Number" property.`,
            ['index', 'popularityNormProperty'],
          );
        }

        if (filterableProperties) {
          for (let i = 0; i < filterableProperties.length; i++) {
            const filterableProperty = filterableProperties[i];
            const objectPath = ['index', 'filterableProperty', i];
            validatePropertyValue(
              filterableProperty,
              'filterableProperty',
              filterablePropertySchema => {
                function isUserSchema(schema: Schema & ObjectSchemaProperty): boolean {
                  return Boolean(
                    schema.type === ValueType.Object &&
                      (schema.codaType === ValueHintType.Person || schema.userEmailProperty || schema.userIdProperty),
                  );
                }
                if (filterablePropertySchema.type === ValueType.Array) {
                  return (
                    [ValueType.Number, ValueType.String].includes(filterablePropertySchema.items.type) ||
                    isUserSchema(filterablePropertySchema.items)
                  );
                }
                return (
                  [ValueType.Boolean, ValueType.Number, ValueType.String].includes(filterablePropertySchema.type) ||
                  isUserSchema(filterablePropertySchema)
                );
              },
              `must be a "ValueType.Boolean", "ValueType.Number", "ValueType.String", "ValueHintType.Person" or an object that has userEmailProperty, userIdProperty specified or an array of "ValueType.Number" or "ValueType.String" or an array of "ValueHintType.Person" or objects that have userEmailProperty, userIdProperty specified.`,
              objectPath,
            );
          }
        }
      })
      .superRefine((data, context) => {
        const schema = data as GenericObjectSchema;
        if (
          !schema.index ||
          !schema.index.filterableProperties ||
          schema.index.filterableProperties.length <= Limits.FilterableProperties
        ) {
          return;
        }

        // Ignore property limit if specified.
        if (
          Exemptions.some(
            exemption =>
              exemption[0] === schema.identity?.packId &&
              exemption[1] === schema.identity?.name &&
              exemption[2] === ExemptionType.FilterablePropertyLimit,
          )
        ) {
          return;
        }

        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['index', 'filterableProperties'],
          message: `Array must contain at most ${Limits.FilterableProperties} element(s)`,
        });
      }),
  );

  const objectPropertyUnionSchema = z
    .union([
      booleanPropertySchema,
      numberPropertySchema,
      stringPropertySchema,
      arrayPropertySchema,
      genericObjectSchema,
    ])
    .refine((schema: Schema) => {
      if (sdkVersion && semver.satisfies(sdkVersion, '<=1.4.0')) {
        // ValueHintType.SelectList is only required for autocomplete starting in version 1.4.1
        return true;
      }
      const schemaForOptions = maybeUnwrapArraySchema(schema);
      const result =
        !schemaForOptions ||
        unwrappedSchemaSupportsOptions(schemaForOptions) ||
        !('options' in schemaForOptions && schemaForOptions.options);
      return result;
    }, 'You must set "codaType" to ValueHintType.SelectList or ValueHintType.Reference when setting an "options" property.');
  const objectPackFormulaSchema = zodCompleteObject<Omit<FormulaOptions<any, ObjectPackFormula<any, any>>, 'execute'>>({
    ...commonPackFormulaSchema,
    resultType: zodDiscriminant(Type.object),
    // TODO(jonathan): See if we should really allow this. The SDK right now explicitly tolerates an undefined
    // schema for objects, but that doesn't seem like a use case we actually want to support.
    schema: z.union([genericObjectSchema, arrayPropertySchema]).optional(),
  });

  const formulaMetadataSchema = z
    .union([numericPackFormulaSchema, stringPackFormulaSchema, booleanPackFormulaSchema, objectPackFormulaSchema])
    .superRefine((data, context) => {
      const parameters = data.parameters as ParamDefs;
      const varargParameters = data.varargParameters || ([] as ParamDefs);
      const paramNames = new Set();
      for (const param of [...parameters, ...varargParameters]) {
        if (paramNames.has(param.name)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['parameters'],
            message: `Parameter names must be unique. Found duplicate name "${param.name}".`,
          });
        }
        paramNames.add(param.name);
      }
    })
    .refine(
      val => {
        return !val.validateParameters;
      },
      {message: 'validateParameters is only allowed on sync formulas.'},
    );

  const formatMetadataSchema = zodCompleteObject<PackFormatMetadata>({
    name: z.string().max(Limits.BuildingBlockName),
    formulaNamespace: z.string().optional(), // Will be removed once we deprecate namespace objects.
    formulaName: z.string(),
    hasNoConnection: z.boolean().optional(),
    instructions: z.string().optional(),
    placeholder: z.string().optional(),
    matchers: z
      .array(z.string().max(Limits.ColumnMatcherRegex).refine(validateFormatMatcher))
      .max(Limits.NumColumnMatchersPerFormat),
  });

  const syncFormulaSchema = zodCompleteObject<
    Omit<
      FormulaOptions<
        any,
        SyncFormula<any, any, ParamDefs, ObjectSchema<any, any>, SyncExecutionContext, SyncPassthroughData>
      >,
      'execute' | 'executeUpdate' | 'executeGetPermissions' | 'onError'
    >
  >({
    schema: arrayPropertySchema.optional(),
    resultType: z.any(),
    isSyncFormula: z.literal(true),
    maxUpdateBatchSize: z.number().min(1).max(Limits.UpdateBatchSize).optional(),
    supportsUpdates: z.boolean().optional(),
    ...commonPackFormulaSchema,
    updateOptions: z.strictObject({extraOAuthScopes: commonPackFormulaSchema.extraOAuthScopes}).optional(),
    maxPermissionBatchSize: z.number().min(1).max(Limits.PermissionsBatchSize).optional(),
    supportsGetPermissions: z.boolean().optional(),
  });

  const baseSyncTableSchema = {
    name: z
      .string()
      .nonempty()
      .max(Limits.BuildingBlockName)
      .regex(regexFormulaName, 'Sync Table names can only contain alphanumeric characters and underscores.'),
    displayName: z.string().max(Limits.BuildingBlockName).optional(),
    description: z.string().max(Limits.BuildingBlockDescription).optional(),
    schema: genericObjectSchema,
    getter: syncFormulaSchema,
    entityName: z.string().optional(),
    defaultAddDynamicColumns: z.boolean().optional(),
    // TODO(patrick): Make identityName non-optional after SDK v1.0.0 is required
    identityName: z
      .string()
      .min(1)
      .max(Limits.BuildingBlockName)
      .optional()
      .refine(
        val => !val || !SystemColumnNames.includes(val),
        `This property name is reserved for internal use by Coda and can't be used as an identityName, sorry!`,
      ),
    // namedAutocompletes no longer does anything, but old SDK version may try to set it.
    namedAutocompletes:
      sdkVersion && semver.satisfies(sdkVersion, '<=1.4.0') ? z.any().optional() : z.never().optional(),
    namedPropertyOptions: z
      .record(formulaMetadataSchema)
      .optional()
      .default({})
      .superRefine((data, context) => {
        if (Object.keys(data).length > Limits.BuildingBlockName) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Too many options formulas for sync table. Max allowed is "${Limits.BuildingBlockName}".`,
          });
        }
      }),
    role: z.nativeEnum(TableRole).optional(),
  };

  type GenericSyncTableDef = SyncTableDef<
    any,
    any,
    ParamDefs,
    ObjectSchema<any, any>,
    SyncExecutionContext,
    SyncPassthroughData
  >;

  const genericSyncTableSchema = zodCompleteObject<GenericSyncTableDef & {isDynamic?: false}>({
    ...baseSyncTableSchema,
    // Add a fake discriminant here so that we can flag union errors as related to a non-matching discriminant
    // and filter them out. A real regular sync table wouldn't specify `isDynamic` at all here, but including
    // it in the validator like this helps zod flag it in the way we need.
    isDynamic: zodDiscriminant(false).optional(),
    getSchema: formulaMetadataSchema.optional(),
  }).strict();

  const genericDynamicSyncTableSchema = zodCompleteObject<
    DynamicSyncTableDef<any, any, ParamDefs, ObjectSchema<any, any>, SyncExecutionContext, SyncPassthroughData> & {
      autocomplete: any;
    }
  >({
    ...baseSyncTableSchema,
    isDynamic: zodDiscriminant(true),
    getName: formulaMetadataSchema,
    getDisplayUrl: formulaMetadataSchema,
    listDynamicUrls: formulaMetadataSchema.optional(),
    searchDynamicUrls: formulaMetadataSchema.optional(),
    getSchema: formulaMetadataSchema,
    autocomplete:
      sdkVersion && semver.satisfies(sdkVersion, '<=1.4.0') ? objectPackFormulaSchema.optional() : z.never().optional(),
    propertyOptions: objectPackFormulaSchema.optional(),
  }).strict();

  const syncTableSchema = z
    .union([genericDynamicSyncTableSchema, genericSyncTableSchema])
    .superRefine((data, context) => {
      const syncTable = data as SyncTable;

      if (syncTable.getter.varargParameters && syncTable.getter.varargParameters.length > 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['getter', 'varargParameters'],
          message: 'Sync table formulas do not currently support varargParameters.',
        });
      }
    });

  const packToolSchema = zodCompleteStrictObject<PackTool>({
    type: z.literal(ToolType.Pack),
    packId: z.number().optional(),
    formulas: z
      .array(
        zodCompleteStrictObject<{
          formulaName: string;
          description?: string;
        }>({
          formulaName: z
            .string()
            .min(1)
            .superRefine((formulaName, context) => {
              if (!validateFormulaName(formulaName)) {
                context.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: `Formula name must be a valid formula name.`,
                });
              }
            }),
          description: z.string().optional(),
        }),
      )
      .optional(),
  });

  const knowledgeToolSourceSchema = z.discriminatedUnion('type', [
    z.object({
      type: z.literal(KnowledgeToolSourceType.Global),
    }),
    z.object({
      type: z.literal(KnowledgeToolSourceType.Pack),
      packId: z.number().optional(),
    }),
  ]);

  const knowledgeToolSchema = zodCompleteStrictObject<KnowledgeTool>({
    type: z.literal(ToolType.Knowledge),
    source: knowledgeToolSourceSchema,
  });

  const screenAnnotationSchema = z.discriminatedUnion('type', [
    z.object({
      type: z.literal(ScreenAnnotationType.Rewrite),
    }),
    z.object({
      type: z.literal(ScreenAnnotationType.Guide),
    }),
  ]);

  const screenAnnotationToolSchema = zodCompleteStrictObject<ScreenAnnotationTool>({
    type: z.literal(ToolType.ScreenAnnotation),
    annotation: screenAnnotationSchema,
  });

  const assistantMessageToolSchema = zodCompleteStrictObject<AssistantMessageTool>({
    type: z.literal(ToolType.AssistantMessage),
  });

  const summarizerToolSchema = zodCompleteStrictObject<SummarizerTool>({
    type: z.literal(ToolType.Summarizer),
  });

  const toolSchema = z.discriminatedUnion('type', [
    packToolSchema,
    knowledgeToolSchema,
    screenAnnotationToolSchema,
    assistantMessageToolSchema,
    summarizerToolSchema,
  ]);
  const skillSchema = zodCompleteObject<Skill>({
    name: z
      .string()
      .min(1)
      .max(Limits.BuildingBlockName)
      .regex(regexParameterName, 'Skill names can only contain alphanumeric characters and underscores.'),
    displayName: z.string().min(1).max(Limits.BuildingBlockName),
    description: z.string().min(1).max(Limits.BuildingBlockDescription),
    prompt: z.string().min(1).max(Limits.PromptLength),
    tools: z.array(toolSchema),
  });

  const skillEntrypointConfigSchema = zodCompleteStrictObject<SkillEntrypointConfig>({
    skillName: z.string(),
  });

  const skillEntrypointsSchema = zodCompleteStrictObject<SkillEntrypoints>({
    benchInitialization: skillEntrypointConfigSchema.optional(),
    defaultChat: skillEntrypointConfigSchema.optional(),
  });

  // Make sure to call the refiners on this after removing legacyPackMetadataSchema.
  // (Zod doesn't let you call .extends() after you've called .refine(), so we're only refining the top-level
  // schema we actually use.)
  const unrefinedPackVersionMetadataSchema = zodCompleteObject<PackVersionMetadata>({
    version: z
      .string()
      .regex(
        /^\d+(\.\d+){0,2}(\-prerelease\.\d+)?$/,
        'Pack versions must use semantic versioning, e.g. "1", "1.0" or "1.0.0".',
      )
      .refine(
        // Version numbers must not be bigger than a postgres integer.
        version => version.split('.').filter(part => Number(part) > 2_147_483_647).length === 0,
        'Pack version number too large',
      ),
    defaultAuthentication: z.union(zodUnionInput(Object.values(defaultAuthenticationValidators))).optional(),
    networkDomains: z
      .array(
        z
          .string()
          .max(Limits.NetworkDomainUrl)
          .refine(domain => !(domain.startsWith('http:') || domain.startsWith('https:') || domain.indexOf('/') >= 0), {
            message: 'Invalid network domain. Instead of "https://www.example.com", just specify "example.com".',
          }),
      )
      .optional(),
    formulaNamespace: z.string().optional().refine(validateNamespace, {
      message: 'Formula namespaces can only contain alphanumeric characters and underscores.',
    }),
    systemConnectionAuthentication: z.union(zodUnionInput(systemAuthenticationValidators)).optional(),
    adminAuthentications: z.array(adminAuthenticationValidator).optional(),
    formulas: z
      .array(formulaMetadataSchema)
      .max(Limits.BuildingBlockCountPerType)
      .optional()
      .default([])
      .superRefine((data, context) => {
        const formulaNames = data.map(formulaDef => formulaDef.name);
        for (const dupe of getNonUniqueElements(formulaNames)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Formula names must be unique. Found duplicate name "${dupe}".`,
          });
        }
      }),
    formats: z
      .array(formatMetadataSchema)
      .max(Limits.BuildingBlockCountPerType)
      .optional()
      .default([])
      .superRefine((data, context) => {
        const formatNames = data.map(formatDef => formatDef.name);
        for (const dupe of getNonUniqueElements(formatNames)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Format names must be unique. Found duplicate name "${dupe}".`,
          });
        }
      }),
    syncTables: z
      .array(syncTableSchema)
      .max(Limits.BuildingBlockCountPerType)
      .optional()
      .default([])
      .superRefine((data, context) => {
        const identityInfo: Map<string, string[]> = new Map();
        const formulaNames: string[] = [];
        for (const tableDef of data) {
          if (tableDef.identityName && tableDef.schema.identity?.name) {
            if (tableDef.identityName !== tableDef.schema.identity.name) {
              context.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Sync table "${tableDef.name}" defines identityName "${tableDef.identityName}" that conflicts with its schema's identity.name "${tableDef.schema.identity.name}".`,
              });
            }
          }
          // only add identity names that are not undefined to check for dupes
          if (tableDef.schema.identity) {
            const allowedAuthenticationNames = identityInfo.get(tableDef.schema.identity.name) || [];
            identityInfo.set(tableDef.schema.identity.name, [
              ...allowedAuthenticationNames,
              ...(tableDef.getter?.allowedAuthenticationNames || [undefined]),
            ]);
          }
          formulaNames.push(tableDef.getter.name);
        }

        validateIdentityNames(context, identityInfo);
        for (const dupe of getNonUniqueElements(formulaNames)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Sync table formula names must be unique. Found duplicate name "${dupe}".`,
          });
        }
        const tableNames = data.map(tableDef => tableDef.name);
        for (const dupe of getNonUniqueElements(tableNames)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Sync table names must be unique. Found duplicate name "${dupe}".`,
          });
        }
      }),
    skills: z
      .array(skillSchema)
      .max(Limits.MaxSkillCount)
      .optional()
      .default([])
      .superRefine((data, context) => {
        const skillNames = data.map(skill => skill.name);
        for (const dupe of getNonUniqueElements(skillNames)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Skill names must be unique. Found duplicate name "${dupe}".`,
          });
        }
      }),
    skillEntrypoints: skillEntrypointsSchema.optional(),
  });

  function validateIdentityNames(context: z.RefinementCtx, identityInfo: Map<string, string[]>) {
    for (const [identityName, allowedAuthenticationNames] of identityInfo) {
      const seenAuthNames = new Set<string | undefined>();
      for (const allowedAuthName of allowedAuthenticationNames) {
        // If no allowedAuthName is provided, the sync table is allowed to use any authentication.
        if (seenAuthNames.has(allowedAuthName) || seenAuthNames.has(undefined)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: allowedAuthName
              ? `Identity "${identityName}" is used by multiple sync tables with non-distinct allowedAuthenticationNames: ${allowedAuthName}`
              : `Sync table identity names must be unique. Found duplicate name "${identityName}".`,
          });
        }
        seenAuthNames.add(allowedAuthName);
      }
    }
  }

  function validateNamespace(namespace: string | undefined): boolean {
    if (typeof namespace === 'undefined') {
      return true;
    }
    return validateFormulaName(namespace);
  }

  function validateFormulaName(value: string): boolean {
    return regexFormulaName.test(value);
  }

  function validateFormulas(schema: z.ZodObject<any>) {
    return schema
      .refine(
        data => {
          if (data.formulas && data.formulas.length > 0) {
            return data.formulaNamespace;
          }
          return true;
        },
        {message: 'A formula namespace must be provided whenever formulas are defined.', path: ['formulaNamespace']},
      )
      .superRefine((untypedMetadata, context) => {
        const metadata = untypedMetadata as PackVersionMetadata;

        for (const authInfo of getAuthentications(metadata)) {
          const {name, authentication} = authInfo;
          if (authentication.type !== AuthenticationType.CodaApiHeaderBearerToken) {
            return;
          }

          const codaDomains = ['coda.io', 'localhost'];

          const hasNonCodaNetwork = metadata.networkDomains?.some((domain: string) => !codaDomains.includes(domain));
          if (!hasNonCodaNetwork) {
            continue;
          }

          const authDomains = getDeclaredAuthNetworkDomains(authentication);
          if (!authDomains?.length) {
            // A non-Coda network domain without auth domain restriction isn't allowed.
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`authentication.${name}.networkDomain`],
              message: `CodaApiHeaderBearerToken can only be used for coda.io domains. Restrict ${name}'s "networkDomain" to coda.io`,
            });
            continue;
          }

          const hasNonCodaAuthDomain = authDomains.some((domain: string) => !codaDomains.includes(domain));
          if (hasNonCodaAuthDomain) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`authentication.${name}.networkDomain`],
              message: `CodaApiHeaderBearerToken can only be used for coda.io domains. Restrict ${name}'s "networkDomain" to coda.io`,
            });
          }
        }
      })
      .superRefine((data, context) => {
        if (data.defaultAuthentication && data.defaultAuthentication.type !== AuthenticationType.None) {
          return;
        }

        // if the pack has no default authentication, make sure all formulas don't set connection requirements.
        // TODO(patrick): Consider allowing a pack to *only* use admin authentications.
        ((data.formulas || []) as PackFormulaMetadata[]).forEach((formula, i) => {
          if (formula.connectionRequirement && formula.connectionRequirement !== ConnectionRequirement.None) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['formulas', i],
              message: 'Formulas cannot set a connectionRequirement when the Pack does not use user authentication.',
            });
          }
        });

        ((data.syncTables as SyncTable[]) || []).forEach((syncTable, i) => {
          const connectionRequirement = syncTable.getter.connectionRequirement;
          if (connectionRequirement && connectionRequirement !== ConnectionRequirement.None) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['syncTables', i, 'getter', 'connectionRequirement'],
              message:
                'Sync table formulas cannot set a connectionRequirement when the Pack does not use user authentication.',
            });
          }
        });
      })
      .superRefine((data, context) => {
        const formulas = (data.formulas || []) as PackFormulaMetadata[];
        ((data.formats as any[]) || []).forEach((format, i) => {
          const formula = formulas.find(f => f.name === format.formulaName);
          if (!formula) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['formats', i],
              message:
                'Could not find a formula definition for this format. Each format must reference the name of a formula defined in this pack.',
            });
          } else {
            let hasError = !formula.parameters?.length;
            const [_, ...extraParams] = formula.parameters || [];
            for (const extraParam of extraParams) {
              if (!extraParam.optional) {
                hasError = true;
              }
            }
            if (hasError) {
              context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['formats', i],
                message: 'Formats can only be implemented using formulas that take exactly one required parameter.',
              });
            }
          }
        });
      })
      .superRefine((data, context) => {
        const metadata = data as PackVersionMetadata;
        const {formulas, syncTables} = metadata;
        const allFormulas = [...formulas, ...syncTables.map(table => table.getter)];
        const authNames = getAuthentications(metadata).map(authInfo => authInfo.name);
        for (const formula of allFormulas) {
          const {allowedAuthenticationNames} = formula;
          if (!allowedAuthenticationNames) {
            continue;
          }
          if (formula.connectionRequirement === ConnectionRequirement.None) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: [formula.name, 'allowedAuthenticationNames'],
              message: `Cannot specify 'allowedAuthenticationNames' on a formula with 'ConnectionRequirement.None'`,
            });
          }
          for (const allowedAuthenticationName of allowedAuthenticationNames) {
            if (
              !authNames.includes(allowedAuthenticationName) &&
              !reservedAuthenticationNames.includes(allowedAuthenticationName)
            ) {
              context.addIssue({
                code: z.ZodIssueCode.custom,
                path: [formula.name, 'allowedAuthenticationNames'],
                message: `${allowedAuthenticationName} is not the name of an authentication`,
              });
            }
          }
        }
      })
      .superRefine((data, _context) => {
        const metadata = data as PackVersionMetadata;
        const {syncTables} = metadata;
        const authentications = getAuthentications(metadata);
        const authNames = authentications.map(authInfo => authInfo.name);
        for (const syncTable of syncTables) {
          const {getter} = syncTable;
          let {allowedAuthenticationNames} = getter;
          // TODO(patrick): Better typing
          if (!isSyncPackFormula(getter as GenericSyncFormula)) {
            continue;
          }
          const {supportsGetPermissions} = getter as GenericSyncFormula;
          if (!supportsGetPermissions) {
            continue;
          }
          // If no auth names are explicitly allowed, then all are assumed to be allowed.
          if (!allowedAuthenticationNames) {
            allowedAuthenticationNames = authNames;
          }
          for (const auth of authentications) {
            const {name} = auth;
            // If a sync table explicitly excludes an authentication, don't require it to
            // be permission-capable.
            if (allowedAuthenticationNames && !allowedAuthenticationNames.includes(name)) {
              continue;
            }
            // Non-admin authentications are allowed to invoke a sync table without
            // requesting permissions.
            if (reservedAuthenticationNames.includes(name)) {
              continue;
            }
          }
        }
      });
  }

  function validateFormatMatcher(value: string): boolean {
    try {
      const parsed = value.match(PACKS_VALID_COLUMN_FORMAT_MATCHER_REGEX);
      if (!parsed) {
        return false;
      }
      const [, pattern, flags] = parsed;
      new RegExp(pattern, flags);
      return true;
    } catch (error: any) {
      return false;
    }
  }

  // We temporarily allow our legacy packs to provide non-versioned data until we sufficiently migrate them.
  // But all fields must be optional, because this is the top-level object we use for validation,
  // so we must be able to pass validation while providing only fields from PackVersionMetadata.
  const legacyPackMetadataSchema = validateFormulas(
    unrefinedPackVersionMetadataSchema.extend({
      id: z.number().optional(),
      name: z.string().nonempty().optional(),
      shortDescription: z.string().nonempty().optional(),
      description: z.string().nonempty().optional(),
      permissionsDescription: z.string().optional(),
      category: z.nativeEnum(PackCategory).optional(),
      logoPath: z.string().optional(),
      exampleImages: z.array(z.string()).optional(),
      exampleVideoIds: z.array(z.string()).optional(),
      minimumFeatureSet: z.nativeEnum(FeatureSet).optional(),
      quotas: z.any().optional(),
      rateLimits: z.any().optional(),
      isSystem: z.boolean().optional(),
    }),
  )
    .superRefine((data, context) => {
      ((data.syncTables as any[]) || []).forEach((syncTable, i) => {
        if (!syncTable.schema?.identity) {
          return;
        }

        const identityName = syncTable.schema.identity.name;
        if (syncTable.schema.properties[identityName]) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['syncTables', i, 'schema', 'properties', identityName],
            message: "Cannot have a sync table property with the same name as the sync table's schema identity.",
          });
        }
      });
    })
    .superRefine((data, context) => {
      ((data.syncTables as any[]) || []).forEach((syncTable, i) => {
        const packId = data.id as number | undefined;
        const getterName = syncTable.getter.name as string;
        if (packId && SyncTableGetterNameExemptions.has(exemptionKey(packId, getterName))) {
          return;
        }

        if (!validateFormulaName(getterName)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['syncTables', i, 'getter', 'name'],
            message: 'Formula names can only contain alphanumeric characters and underscores.',
          });
        }
      });
    })
    .superRefine((data, context) => {
      const {syncTables} = data as PackVersionDefinition;
      if (syncTables) {
        validateCrawlHierarchy(syncTables, context);
        validateParents(syncTables, context);
      }
    })
    .superRefine((data, context) => {
      ((data.formulas as any[]) || []).forEach((formula, i) => {
        // We have to validate regular formula names here as a superRefine because formulas share
        // a validator with sync table getters, and we need pack ids to exempt certain legacy
        // formula getters with spaces in their names.
        if (!validateFormulaName(formula.name)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['formulas', i, 'name'],
            message: 'Formula names can only contain alphanumeric characters and underscores.',
          });
        }
      });
    })
    .refine(
      data => {
        const authentications = getAuthentications(data as PackVersionMetadata);
        if (
          data.networkDomains?.length ||
          authentications.every(
            auth =>
              auth.authentication.type === AuthenticationType.None ||
              // Various is an internal authentication type that's only applicable to whitelisted Pack Ids.
              // Skipping validation here to let it exempt from network domains.
              auth.authentication.type === AuthenticationType.Various ||
              (auth.authentication.requiresEndpointUrl && !auth.authentication.endpointDomain),
          )
        ) {
          return true;
        }

        return false;
      },
      {
        message:
          'This pack uses authentication but did not declare a network domain. ' +
          "Specify the domain that your pack makes http requests to using `networkDomains: ['example.com']`",
        path: ['networkDomains'],
      },
    )
    .superRefine((untypedData, context) => {
      const data = untypedData as PackVersionMetadata;

      for (const authInfo of getAuthentications(data)) {
        const {name, authentication} = authInfo;
        const authNetworkDomains = getDeclaredAuthNetworkDomains(authentication);

        if (!isDefined(authNetworkDomains)) {
          // This is a Various or None auth pack.
          return;
        }

        const readableAuthTitle =
          name === ReservedAuthenticationNames.Default ? 'setUserAuthentication()' : `authentication ${name}`;

        // Auth network domains must match pack network domains.
        for (const authNetworkDomain of authNetworkDomains) {
          if (!data.networkDomains?.includes(authNetworkDomain)) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`authentication.${name}.networkDomain`],
              message: `The "networkDomain" in ${readableAuthTitle} must match a previously declared network domain.`,
            });
            return;
          }
        }

        const usedNetworkDomains = getUsedAuthNetworkDomains(authentication);
        if (usedNetworkDomains) {
          for (const usedNetworkDomain of usedNetworkDomains) {
            if (authNetworkDomains.length > 0 && !authNetworkDomains.includes(usedNetworkDomain)) {
              context.addIssue({
                code: z.ZodIssueCode.custom,
                path: [`authentication.${name}`],
                message: `Domain ${usedNetworkDomain} is used in ${readableAuthTitle} but not declared in its "networkDomain".`,
              });
              return;
            }
          }
        }
      }
    })
    .superRefine((untypedData, context) => {
      const data = untypedData as PackVersionMetadata;
      if (!data.networkDomains) {
        return;
      }

      for (const authInfo of getAuthentications(data)) {
        const {name, authentication} = authInfo;
        const readableAuthTitle =
          name === ReservedAuthenticationNames.Default ? 'setUserAuthentication()' : `authentication ${name}`;

        const usedNetworkDomains = getUsedAuthNetworkDomains(authentication);
        if (usedNetworkDomains) {
          for (const usedNetworkDomain of usedNetworkDomains) {
            if (
              !data.networkDomains.some(
                domain => domain === usedNetworkDomain || usedNetworkDomain.endsWith('.' + domain),
              )
            ) {
              context.addIssue({
                code: z.ZodIssueCode.custom,
                path: [`authentication.${name}`],
                message: `Domain ${usedNetworkDomain} is used in ${readableAuthTitle} but not declared in the pack's "networkDomains".`,
              });
              return;
            }
          }
        }
      }
    })
    .superRefine((untypedData, context) => {
      const data = untypedData as PackVersionMetadata;

      for (const authInfo of getAuthentications(data)) {
        const {name, authentication} = authInfo;
        const authNetworkDomains = getDeclaredAuthNetworkDomains(authentication);

        if (!isDefined(authNetworkDomains)) {
          // This is a Various or None auth pack.
          return;
        }

        const readableAuthTitle =
          name === ReservedAuthenticationNames.Default ? 'setUserAuthentication()' : `authentication ${name}`;

        // A pack with multiple networks and auth must choose which domain(s) get auth on them.
        if (!authNetworkDomains?.length) {
          if (data.networkDomains && data.networkDomains.length > 1) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: [`authentication.${name}.networkDomain`],
              message: `This pack uses multiple network domains and must set one as a "networkDomain" in ${readableAuthTitle}`,
            });
          }
          return;
        }
      }
    })
    .superRefine((untypedData, context) => {
      const data = untypedData as PackVersionMetadata;

      (data.syncTables || []).forEach((syncTable, i) => {
        const schema: ObjectSchema<any, any> = syncTable.schema;
        for (const [propertyName, childSchema] of Object.entries(schema.properties)) {
          const options = maybeSchemaOptionsValue(childSchema);
          if (!options || Array.isArray(options)) {
            continue;
          }
          if (typeof options !== 'string' || !(options in (syncTable.namedPropertyOptions || {}))) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['syncTables', i, 'properties', propertyName, 'options'],
              message:
                options === OptionsType.Dynamic
                  ? `Sync table ${syncTable.name} must define "options" for this property to use OptionsType.Dynamic`
                  : `"${options}" is not registered as an options function for this sync table.`,
            });
            continue;
          }
        }
      });
    })
    .superRefine((data, context) => {
      const metadata = data as PackVersionMetadata;
      const {skills, skillEntrypoints} = metadata;

      if (!skillEntrypoints) {
        return;
      }

      const skillNames = new Set((skills || []).map(skill => skill.name));

      for (const [path, entrypoint] of Object.entries(skillEntrypoints)) {
        if (!skillNames.has(entrypoint.skillName)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['skillEntrypoints', path, 'skillName'],
            message: `"${entrypoint.skillName}" is not the name of a defined skill.`,
          });
        }
      }
    });

  return {legacyPackMetadataSchema, variousSupportedAuthenticationValidators, arrayPropertySchema};
}

interface SchemaExtension {
  versionRange: string;
  schemaExtend: (schema: z.ZodType<Partial<PackVersionMetadata>>) => z.ZodType<Partial<PackVersionMetadata>>;
}

function getAuthentications(data: PackVersionMetadata): Array<{name: string; authentication: AuthenticationMetadata}> {
  const authentications: Array<{name: string; authentication: AuthenticationMetadata}> = [];
  if (data.defaultAuthentication) {
    authentications.push({name: ReservedAuthenticationNames.Default, authentication: data.defaultAuthentication});
  }
  if (data.systemConnectionAuthentication) {
    authentications.push({
      name: ReservedAuthenticationNames.System,
      authentication: data.systemConnectionAuthentication,
    });
  }
  if (data.adminAuthentications) {
    authentications.push(...data.adminAuthentications);
  }
  return authentications;
}

/**
 * Return all the domain names that should be validated against declared network domains.
 * This function just ignores any relative or un-parse-able URLs, trusting that other validations
 * have already caught such issues.
 *
 * We may eventually decide that includeOAuthTokenUrls should default true, but that would be
 * backwards incompatible for packs that use services like Google, where their authorizationUrl &
 * tokenUrl use a different domain than the API domain that is set on networkDomains.
 */
function getUsedAuthNetworkDomains(
  authentication: AuthenticationMetadata,
  includeOAuthTokenUrls: boolean = false,
): string[] | undefined {
  if (authentication.type === AuthenticationType.None || authentication.type === AuthenticationType.Various) {
    return undefined;
  }
  const {endpointDomain, type} = authentication;
  const domains: string[] = [];
  if (endpointDomain) {
    domains.push(endpointDomain);
  }
  if (!includeOAuthTokenUrls) {
    return domains;
  }
  switch (type) {
    case AuthenticationType.OAuth2: {
      const {authorizationUrl, tokenUrl} = authentication;
      const parsedAuthUrl = URLParse(authorizationUrl);
      if (parsedAuthUrl.hostname) {
        domains.push(parsedAuthUrl.hostname);
      }
      const parsedTokenUrl = URLParse(tokenUrl);
      if (parsedTokenUrl.hostname) {
        domains.push(parsedTokenUrl.hostname);
      }
      return domains;
    }
    case AuthenticationType.OAuth2ClientCredentials: {
      const {tokenUrl} = authentication;
      if (endpointDomain) {
        domains.push(endpointDomain);
      }
      const parsedTokenUrl = URLParse(tokenUrl);
      if (parsedTokenUrl.hostname) {
        domains.push(parsedTokenUrl.hostname);
      }
      return domains;
    }
    case AuthenticationType.AWSAccessKey:
    case AuthenticationType.AWSAssumeRole:
    case AuthenticationType.CodaApiHeaderBearerToken:
    case AuthenticationType.Custom:
    case AuthenticationType.CustomHeaderToken:
    case AuthenticationType.GoogleDomainWideDelegation:
    case AuthenticationType.GoogleServiceAccount:
    case AuthenticationType.HeaderBearerToken:
    case AuthenticationType.MultiHeaderToken:
    case AuthenticationType.MultiQueryParamToken:
    case AuthenticationType.QueryParamToken:
    case AuthenticationType.WebBasic:
      return domains;
    default:
      ensureUnreachable(type);
  }
}

// Returns undefined for None or Various auth, otherwise returns a string array.
function getDeclaredAuthNetworkDomains(authentication: AuthenticationMetadata): string[] | undefined {
  if (authentication.type === AuthenticationType.Various || authentication.type === AuthenticationType.None) {
    return undefined;
  }

  if (Array.isArray(authentication.networkDomain)) {
    return authentication.networkDomain;
  } else if (authentication.networkDomain) {
    return [authentication.networkDomain];
  }
  return [];
}

// TODO(dweitzman): Migrate SchemaExtensions to use conditionals in buildMetadataSchema() and delete
// the SchemaExtension feature.
const packMetadataSchemaBySdkVersion: SchemaExtension[] = [
  {
    versionRange: '>=1.0.0',
    schemaExtend: schema => {
      return schema.superRefine((untypedData, context) => {
        const data = untypedData as PackVersionMetadata;
        data.formulas.forEach((formula, i) => {
          formula.parameters.forEach((param, j) => {
            validateDeprecatedParameterFields(param, ['formulas', i, 'parameters', j], context);
          });
          (formula.varargParameters || []).forEach((param, j) => {
            validateDeprecatedParameterFields(param, ['formulas', i, 'varargParameters', j], context);
          });
          if (formula.schema) {
            validateSchemaDeprecatedFields(formula.schema, ['formulas', i, 'schema'], context);
          }
        });
        data.syncTables.forEach((syncTable, i) => {
          syncTable.getter.parameters.forEach((param, j) => {
            validateDeprecatedParameterFields(param, ['syncTables', i, 'getter', 'parameters', j], context);
          });
          (syncTable.getter.varargParameters || []).forEach((param, j) => {
            validateDeprecatedParameterFields(param, ['syncTables', i, 'getter', 'varargParameters', j], context);
          });

          const schemaPathPrefix = ['syncTables', i, 'schema'];
          validateSchemaDeprecatedFields(syncTable.schema, schemaPathPrefix, context);

          // A blank string will fail the existing `min(1)` requirement in the zod schema, so
          // we only need to additionally make sure there is a value present.
          if (typeof syncTable.identityName !== 'string') {
            let receivedType: ZodParsedType = ZodParsedType.unknown;
            if (syncTable.identityName === undefined) {
              receivedType = ZodParsedType.undefined;
            } else if (syncTable.identityName === null) {
              receivedType = ZodParsedType.null;
            }
            context.addIssue({
              code: z.ZodIssueCode.invalid_type,
              path: ['syncTables', i, 'identityName'],
              message: 'An identityName is required on all sync tables',
              expected: ZodParsedType.string,
              received: receivedType,
            });
          }
        });

        for (const auth of getAuthentications(data)) {
          const {authentication, name} = auth;
          if (authentication && authentication.type !== AuthenticationType.None && authentication.postSetup) {
            authentication.postSetup.forEach((step, i) => {
              validateDeprecatedProperty({
                obj: step,
                oldName: 'getOptionsFormula',
                newName: 'getOptions',
                pathPrefix: ['authentication', name, 'postSetup', i],
                context,
              });
            });
          }
        }
      });
    },
  },
];

function validateSchemaDeprecatedFields(
  schema: Schema,
  pathPrefix: Array<string | number>,
  context: z.RefinementCtx,
): void {
  if (isObject(schema)) {
    validateObjectSchemaDeprecatedFields(schema, pathPrefix, context);
  }
  if (isArray(schema)) {
    validateSchemaDeprecatedFields(schema.items, [...pathPrefix, 'items'], context);
  }
}

function validateObjectSchemaDeprecatedFields(
  schema: GenericObjectSchema,
  pathPrefix: Array<string | number>,
  context: z.RefinementCtx,
): void {
  validateDeprecatedProperty({
    obj: schema,
    oldName: 'id',
    newName: 'idProperty',
    pathPrefix,
    context,
  });
  validateDeprecatedProperty({
    obj: schema,
    oldName: 'primary',
    newName: 'displayProperty',
    pathPrefix,
    context,
  });
  validateDeprecatedProperty({
    obj: schema,
    oldName: 'featured',
    newName: 'featuredProperties',
    pathPrefix,
    context,
  });

  if (schema.identity?.attribution) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: [...pathPrefix, 'identity', 'attribution'],
      message:
        'Attribution has moved and is no longer nested in the Identity object. ' +
        'Instead of specifying `schema.identity.attribution`, simply specify `schema.attribution`.',
    });
  }

  for (const [propertyName, childSchema] of Object.entries(schema.properties)) {
    validateSchemaDeprecatedFields(childSchema, [...pathPrefix, 'properties', propertyName], context);
  }
}

function validateDeprecatedProperty<T extends {}>({
  obj,
  oldName,
  newName,
  pathPrefix,
  context,
}: {
  obj: T;
  oldName: string;
  newName?: string;
  pathPrefix: Array<string | number>;
  context: z.RefinementCtx;
}) {
  if (obj[oldName as keyof T] !== undefined) {
    let message = `Property name "${oldName}" is no longer accepted.`;
    if (newName) {
      message += ` Use "${newName}" instead.`;
    }
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: [...pathPrefix, oldName],
      message,
    });
  }
}

function validateDeprecatedParameterFields<T extends UnionType>(
  param: ParamDef<T>,
  pathPrefix: Array<string | number>,
  context: z.RefinementCtx,
) {
  validateDeprecatedProperty({
    obj: param,
    oldName: 'defaultValue',
    newName: 'suggestedValue',
    pathPrefix,
    context,
  });
}

function isAbsoluteUrl(url: string): boolean {
  return url.startsWith('https://');
}

function parseDomainName(url: string): string | undefined {
  if (!isAbsoluteUrl(url)) {
    return;
  }
  const parsed = URLParse(url);
  return parsed.hostname;
}

function validateUrlParsesIfAbsolute(url: string) {
  if (!isAbsoluteUrl(url)) {
    return true;
  }
  return Boolean(parseDomainName(url));
}
