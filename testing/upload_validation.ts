import type {AWSSignature4Authentication} from '../types';
import type {ArraySchema} from '../schema';
import {AttributionNodeType} from '../schema';
import {AuthenticationType} from '../types';
import type {BooleanSchema} from '../schema';
import type {CodaApiBearerTokenAuthentication} from '../types';
import type {CustomHeaderTokenAuthentication} from '../types';
import {DefaultConnectionType} from '../types';
import type {DynamicSyncTableDef} from '../api';
import {FeatureSet} from '../types';
import type {HeaderBearerTokenAuthentication} from '../types';
import type {Identity} from '../schema';
import type {MultiQueryParamTokenAuthentication} from '../types';
import type {Network} from '../api_types';
import type {NoAuthentication} from '../types';
import {NumberHintValueTypes} from '../schema';
import type {NumberSchema} from '../schema';
import type {NumericPackFormula} from '../api';
import type {OAuth2Authentication} from '../types';
import {ObjectHintValueTypes} from '../schema';
import type {ObjectPackFormula} from '../api';
import type {ObjectSchema} from '../schema';
import type {ObjectSchemaProperty} from '../schema';
import {PackCategory} from '../types';
import type {PackFormatMetadata} from '../compiled_types';
import type {PackVersionMetadata} from '../compiled_types';
import type {ParamDef} from '../api_types';
import type {ParamDefs} from '../api_types';
import {PostSetupType} from '../types';
import type {QueryParamTokenAuthentication} from '../types';
import type {SetEndpoint} from '../types';
import {StringHintValueTypes} from '../schema';
import type {StringPackFormula} from '../api';
import type {StringSchema} from '../schema';
import type {SyncFormula} from '../api';
import type {SyncTableDef} from '../api';
import type {SystemAuthenticationTypes} from '../types';
import {Type} from '../api_types';
import type {ValidationError} from './types';
import {ValueType} from '../schema';
import type {VariousAuthentication} from '../types';
import type {VariousSupportedAuthenticationTypes} from '../types';
import type {WebBasicAuthentication} from '../types';
import {assertCondition} from '../helpers/ensure';
import {isNil} from '../helpers/object_utils';
import * as z from 'zod';

enum CustomErrorCode {
  NonMatchingDiscriminant = 'nonMatchingDiscriminant',
}

export class PackMetadataValidationError extends Error {
  readonly originalError: Error | undefined;
  readonly validationErrors: ValidationError[] | undefined;

  constructor(message: string, originalError?: Error, validationErrors?: ValidationError[]) {
    super(message);
    this.originalError = originalError;
    this.validationErrors = validationErrors;
  }
}

export async function validatePackVersionMetadata(metadata: Record<string, any>): Promise<PackVersionMetadata> {
  // For now we use legacyPackMetadataSchema as the top-level object we validate. As soon as we migrate all of our
  // first-party pack definitions to only use versioned fields, we can use packVersionMetadataSchema  here.
  const validated = legacyPackMetadataSchema.safeParse(metadata);
  if (!validated.success) {
    throw new PackMetadataValidationError(
      'Pack metadata failed validation',
      validated.error,
      validated.error.errors.flatMap(zodErrorDetailToValidationError),
    );
  }

  return validated.data as PackVersionMetadata;
}

export function validateVariousAuthenticationMetadata(auth: any): VariousAuthentication {
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

function zodErrorDetailToValidationError(subError: z.ZodIssue): ValidationError[] {
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
  return z.union([z.string(), z.number(), z.boolean(), z.undefined()]).refine(data => data === value, {
    message: 'Non-matching discriminant',
    params: {customErrorCode: CustomErrorCode.NonMatchingDiscriminant},
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
  getOptionsFormula: z.unknown(),
});

const baseAuthenticationValidators = {
  // TODO(jonathan): Remove these after fixing/exporting types for Authentication metadata, as they're only present
  // in the full bundle, not the metadata.
  getConnectionName: z.unknown().optional(),
  getConnectionUserId: z.unknown().optional(),
  defaultConnectionType: z.nativeEnum(DefaultConnectionType).optional(),
  instructionsUrl: z.string().optional(),
  requiresEndpointUrl: z.boolean().optional(),
  endpointDomain: z.string().optional(),
  // The items are technically a discriminated union type but that union currently only has one member.
  postSetup: z.array(setEndpointPostSetupValidator).optional(),
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
  [AuthenticationType.QueryParamToken]: zodCompleteStrictObject<QueryParamTokenAuthentication>({
    type: zodDiscriminant(AuthenticationType.QueryParamToken),
    paramName: z.string(),
    ...baseAuthenticationValidators,
  }),
  [AuthenticationType.MultiQueryParamToken]: zodCompleteStrictObject<MultiQueryParamTokenAuthentication>({
    type: zodDiscriminant(AuthenticationType.MultiQueryParamToken),
    params: z.array(
      zodCompleteStrictObject<MultiQueryParamTokenAuthentication['params'][number]>({
        name: z.string(),
        description: z.string(),
      }),
    ),
    ...baseAuthenticationValidators,
  }),
  [AuthenticationType.OAuth2]: zodCompleteStrictObject<OAuth2Authentication>({
    type: zodDiscriminant(AuthenticationType.OAuth2),
    authorizationUrl: z.string(),
    tokenUrl: z.string(),
    scopes: z.array(z.string()).optional(),
    tokenPrefix: z.string().optional(),
    additionalParams: z.record(z.any()).optional(),
    clientIdEnvVarName: z.string().optional(), // Deprecated
    clientSecretEnvVarName: z.string().optional(), // Deprecated
    endpointKey: z.string().optional(),
    tokenQueryParam: z.string().optional(),
    ...baseAuthenticationValidators,
  }),
  [AuthenticationType.WebBasic]: zodCompleteStrictObject<WebBasicAuthentication>({
    type: zodDiscriminant(AuthenticationType.WebBasic),
    uxConfig: zodCompleteStrictObject<WebBasicAuthentication['uxConfig']>({
      placeholderUsername: z.string().optional(),
      placeholderPassword: z.string().optional(),
      usernameOnly: z.boolean().optional(),
    }),
    ...baseAuthenticationValidators,
  }),
  [AuthenticationType.AWSSignature4]: zodCompleteStrictObject<AWSSignature4Authentication>({
    type: zodDiscriminant(AuthenticationType.AWSSignature4),
    service: z.string(),
    ...baseAuthenticationValidators,
  }),
  [AuthenticationType.Various]: zodCompleteStrictObject<VariousAuthentication>({
    type: zodDiscriminant(AuthenticationType.Various),
  }),
};

const systemAuthenticationTypes: {[key in SystemAuthenticationTypes]: true} = {
  [AuthenticationType.HeaderBearerToken]: true,
  [AuthenticationType.CustomHeaderToken]: true,
  [AuthenticationType.MultiQueryParamToken]: true,
  [AuthenticationType.QueryParamToken]: true,
  [AuthenticationType.WebBasic]: true,
  [AuthenticationType.AWSSignature4]: true,
}

const systemAuthenticationValidators = Object.entries(defaultAuthenticationValidators)
  .filter(([authType]) => authType in systemAuthenticationTypes)
  .map(([_authType, schema]) => schema);

const variousSupportedAuthenticationTypes: {[key in VariousSupportedAuthenticationTypes]: true} = {
  [AuthenticationType.HeaderBearerToken]: true,
  [AuthenticationType.CustomHeaderToken]: true,
  [AuthenticationType.MultiQueryParamToken]: true,
  [AuthenticationType.QueryParamToken]: true,
  [AuthenticationType.WebBasic]: true,
  [AuthenticationType.None]: true,
}

const variousSupportedAuthenticationValidators = Object.entries(defaultAuthenticationValidators)
  .filter(([authType]) => authType in variousSupportedAuthenticationTypes)
  .map(([_authType, schema]) => schema);

const primitiveUnion = z.union([z.number(), z.string(), z.boolean(), z.date()]);

const paramDefValidator = zodCompleteObject<ParamDef<any>>({
  name: z.string(),
  type: z.union([z.nativeEnum(Type), z.object({type: zodDiscriminant('array'), items: z.nativeEnum(Type)})]),
  description: z.string(),
  optional: z.boolean().optional(),
  hidden: z.boolean().optional(),
  autocomplete: z.unknown(),
  defaultValue: z.unknown(),
});

const commonPackFormulaSchema = {
  name: z
    .string()
    .refine(validateFormulaName, {message: 'Formula names can only contain alphanumeric characters and underscores.'}),
  description: z.string(),
  examples: z.array(
    z.object({
      params: z.union([primitiveUnion, z.array(primitiveUnion)]),
      result: z.any(),
    }),
  ),
  parameters: z.array(paramDefValidator),
  varargParameters: z.array(paramDefValidator).optional(),
  network: zodCompleteObject<Network>({
    hasSideEffect: z.boolean().optional(),
    requiresConnection: z.boolean().optional(),
  }).optional(),
  cacheTtlSecs: z.number().min(0).optional(),
  isExperimental: z.boolean().optional(),
  isSystem: z.boolean().optional(),
};

const numericPackFormulaSchema = zodCompleteObject<Omit<NumericPackFormula<any>, 'execute'>>({
  ...commonPackFormulaSchema,
  resultType: zodDiscriminant(Type.number),
  schema: zodCompleteObject<NumberSchema>({
    type: zodDiscriminant(ValueType.Number),
    codaType: z.enum([...NumberHintValueTypes]).optional(),
    description: z.string().optional(),
  }).optional(),
});

const stringPackFormulaSchema = zodCompleteObject<Omit<StringPackFormula<any>, 'execute'>>({
  ...commonPackFormulaSchema,
  resultType: zodDiscriminant(Type.string),
  schema: zodCompleteObject<StringSchema>({
    type: zodDiscriminant(ValueType.String),
    codaType: z.enum([...StringHintValueTypes]).optional(),
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

const basePropertyValidators = {
  description: z.string().optional(),
  fromKey: z.string().optional(),
  required: z.boolean().optional(),
};

const booleanPropertySchema = zodCompleteObject<BooleanSchema & ObjectSchemaProperty>({
  type: zodDiscriminant(ValueType.Boolean),
  ...basePropertyValidators,
});

const numberPropertySchema = zodCompleteObject<NumberSchema & ObjectSchemaProperty>({
  type: zodDiscriminant(ValueType.Number),
  codaType: z.enum([...NumberHintValueTypes]).optional(),
  ...basePropertyValidators,
});

const stringPropertySchema = zodCompleteObject<StringSchema & ObjectSchemaProperty>({
  type: zodDiscriminant(ValueType.String),
  codaType: z.enum([...StringHintValueTypes]).optional(),
  ...basePropertyValidators,
});

// TODO(jonathan): Give this a better type than ZodTypeAny after figuring out
// recurise typing better.
const arrayPropertySchema: z.ZodTypeAny = z.lazy(() =>
  zodCompleteObject<ArraySchema & ObjectSchemaProperty>({
    type: zodDiscriminant(ValueType.Array),
    items: objectPropertyUnionSchema,
    ...basePropertyValidators,
  }),
);

const Base64ObjectRegex = /^[A-Za-z0-9=_-]+$/;
// This is ripped off from isValidObjectId in coda. Violating this causes a number of downstream headaches.
function isValidObjectId(component: string): boolean {
  return Base64ObjectRegex.test(component);
}

// These sync tables already violate the object id constraints and should be cleaned up via upgrade.
const BAD_SYNC_TABLE_NAMES = [
  'Pull Request',
  'Merge Request',
  'G Suite Directory User',
  'Campaign Group',
  'Candidate Stage',
  'Person Schema',
  'Doc Analytics',
];

function isValidIdentityName(name: string): boolean {
  if (BAD_SYNC_TABLE_NAMES.includes(name)) {
    return true;
  }
  return isValidObjectId(name);
}

const genericObjectSchema: z.ZodTypeAny = z.lazy(() =>
  zodCompleteObject<ObjectSchema<any, any>>({
    type: zodDiscriminant(ValueType.Object),
    description: z.string().optional(),
    id: z.string().optional(),
    primary: z.string().optional(),
    codaType: z.enum([...ObjectHintValueTypes]).optional(),
    featured: z.array(z.string()).optional(),
    identity: zodCompleteObject<Identity>({
      packId: z.number(), // TODO: Remove
      name: z.string().nonempty().refine(isValidIdentityName, {
        message:
          'Invalid name. Identity names can only contain alphanumeric characters, underscores, and dashes, and no spaces.',
      }),
      dynamicUrl: z.string().optional(),
      attribution: z
        .union([textAttributionNodeSchema, linkAttributionNodeSchema, imageAttributionNodeSchema])
        .optional(),
    }).optional(),
    properties: z.record(objectPropertyUnionSchema),
  })
    .refine(data => isNil(data.id) || data.id in data.properties, {
      message: 'The "id" property must appear as a key in the "properties" object.',
    })
    .refine(data => isNil(data.primary) || data.primary in data.properties, {
      message: 'The "primary" property must appear as a key in the "properties" object.',
    })
    .refine(
      data => {
        for (const f of data.featured || []) {
          if (!(f in data.properties)) {
            return false;
          }
        }
        return true;
      },
      {message: 'One or more of the "featured" fields do not appear in the "properties" object.'},
    ),
);

const objectPropertyUnionSchema = z.union([
  booleanPropertySchema,
  numberPropertySchema,
  stringPropertySchema,
  arrayPropertySchema,
  genericObjectSchema,
]);

const objectPackFormulaSchema = zodCompleteObject<Omit<ObjectPackFormula<any, any>, 'execute'>>({
  ...commonPackFormulaSchema,
  resultType: zodDiscriminant(Type.object),
  // TODO(jonathan): See if we should really allow this. The SDK right now explicitly tolerates an undefined
  // schema for objects, but that doesn't seem like a use case we actually want to support.
  schema: z.union([genericObjectSchema, arrayPropertySchema]).optional(),
});

const formulaMetadataSchema = z.union([numericPackFormulaSchema, stringPackFormulaSchema, objectPackFormulaSchema]);

const formatMetadataSchema = zodCompleteObject<PackFormatMetadata>({
  name: z.string(),
  formulaNamespace: z.string(), // Will be removed once we deprecate namespace objects.
  formulaName: z.string(),
  hasNoConnection: z.boolean().optional(),
  instructions: z.string().optional(),
  logoPath: z.string().optional(), // Should move to the UI somehow
  placeholder: z.string().optional(),
  matchers: z.array(z.string()),
});

const syncFormulaSchema = zodCompleteObject<Omit<SyncFormula<any, any, ParamDefs, ObjectSchema<any, any>>, 'execute'>>({
  schema: arrayPropertySchema.optional(),
  resultType: z.any(),
  isSyncFormula: z.literal(true),
  ...commonPackFormulaSchema,
});

const baseSyncTableSchema = {
  name: z.string().nonempty(),
  schema: genericObjectSchema,
  getter: syncFormulaSchema,
  entityName: z.string().optional(),
};

type GenericSyncTableDef = SyncTableDef<any, any, ParamDefs, ObjectSchema<any, any>>;

const genericSyncTableSchema = zodCompleteObject<GenericSyncTableDef & {isDynamic?: false}>({
  ...baseSyncTableSchema,
  // Add a fake discriminant here so that we can flag union errors as related to a non-matching discriminant
  // and filter them out. A real regular sync table wouldn't specify `isDynamic` at all here, but including
  // it in the validator like this helps zod flag it in the way we need.
  isDynamic: zodDiscriminant(false).optional(),
  getSchema: formulaMetadataSchema.optional(),
}).strict();

const genericDynamicSyncTableSchema = zodCompleteObject<
  DynamicSyncTableDef<any, any, ParamDefs, ObjectSchema<any, any>>
>({
  ...baseSyncTableSchema,
  isDynamic: zodDiscriminant(true),
  getName: formulaMetadataSchema,
  getDisplayUrl: formulaMetadataSchema,
  listDynamicUrls: formulaMetadataSchema.optional(),
  getSchema: formulaMetadataSchema,
}).strict();

const syncTableSchema = z.union([genericDynamicSyncTableSchema, genericSyncTableSchema]);

// Make sure to call the refiners on this after removing legacyPackMetadataSchema.
// (Zod doesn't let you call .extends() after you've called .refine(), so we're only refining the top-level
// schema we actually use.)
const unrefinedPackVersionMetadataSchema = zodCompleteObject<PackVersionMetadata>({
  version: z
    .string()
    .regex(/^\d+(\.\d+){0,2}$/, 'Pack versions must use semantic versioning, e.g. "1", "1.0" or "1.0.0".'),
  defaultAuthentication: z.union(zodUnionInput(Object.values(defaultAuthenticationValidators))).optional(),
  networkDomains: z.array(z.string()).optional(),
  formulaNamespace: z.string().optional().refine(validateNamespace, {
    message: 'Formula namespaces can only contain alphanumeric characters and underscores.',
  }),
  systemConnectionAuthentication: z.union(zodUnionInput(systemAuthenticationValidators)).optional(),
  formulas: z.array(formulaMetadataSchema).optional().default([]),
  formats: z.array(formatMetadataSchema).optional().default([]),
  syncTables: z.array(syncTableSchema).optional().default([]),
});

// The following largely copied from tokens.ts for parsing formula names.
const letterChar = String.raw`\p{L}`;
const numberChar = String.raw`\p{N}`;
const wordChar = String.raw`${letterChar}${numberChar}_`;
const regexLetterChar = String.raw`[${letterChar}]`;
const regexWordChar = String.raw`[${wordChar}]`;
const regexFormulaNameStr = String.raw`^${regexLetterChar}(?:${regexWordChar}+)?$`;
const regexFormulaName = new RegExp(regexFormulaNameStr, 'u');

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
    .refine(
      data => {
        const formulas = (data.formulas || []) as PackFormatMetadata[];
        const formulaNames = new Set(formulas.map(f => f.name));
        for (const format of data.formats || []) {
          if (!formulaNames.has(format.formulaName)) {
            return false;
          }
        }
        return true;
      },
      {
        // Annoying that the we can't be more precise and identify in the message which format had the issue;
        // these error messages are static.
        message:
          'Could not find a formula for one or more matchers. Check that the "formulaName" for each matcher ' +
          'matches the name of a formula defined in this pack.',
        path: ['formats'],
      },
    );
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
    enabledConfigName: z.string().optional(),
    exampleImages: z.array(z.string()).optional(),
    exampleVideoIds: z.array(z.string()).optional(),
    minimumFeatureSet: z.nativeEnum(FeatureSet).optional(),
    quotas: z.any().optional(),
    rateLimits: z.any().optional(),
    isSystem: z.boolean().optional(),
  }),
).refine(
  data => {
    for (const syncTable of data.syncTables) {
      if (!syncTable.schema?.identity) {
        continue;
      }

      const identityName = syncTable.schema.identity.name;
      if (syncTable.schema.properties[identityName]) {
        return false;
      }
    }

    return true;
  },
  {
    message: "Cannot have a sync table property with the same name as the sync table's schema identity.",
  },
);
