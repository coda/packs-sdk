import type {AWSSignature4Authentication} from '../types';
import type {ArraySchema} from '../schema';
import {AttributionNodeType} from '../schema';
import {AuthenticationType} from '../types';
import type {BooleanSchema} from '../schema';
import type {CodaApiBearerTokenAuthentication} from '../types';
import type {CustomHeaderTokenAuthentication} from '../types';
import {DefaultConnectionType} from '../types';
import {FeatureSet} from '../types';
import type {HeaderBearerTokenAuthentication} from '../types';
import type {Identity} from '../schema';
import type {MultiQueryParamTokenAuthentication} from '../types';
import type {Network} from 'index';
import type {NoAuthentication} from '../types';
import {NumberHintValueTypes} from '../schema';
import type {NumberSchema} from '../schema';
import type {NumericPackFormula} from 'api';
import type {OAuth2Authentication} from '../types';
import {ObjectHintValueTypes} from '../schema';
import type {ObjectPackFormula} from 'api';
import type {ObjectSchema} from '../schema';
import type {ObjectSchemaProperty} from '../schema';
import {PackCategory} from '../types';
import type {PackFormatMetadata} from 'index';
import type {PackMetadata} from 'index';
import type {PackUpload} from 'compiled_types';
import type {ParamDef} from 'index';
import {PostSetupType} from '../types';
import type {QueryParamTokenAuthentication} from '../types';
import type {SetEndpoint} from '../types';
import {StringHintValueTypes} from '../schema';
import type {StringPackFormula} from 'api';
import type {StringSchema} from '../schema';
import {Type} from 'index';
import type {ValidationError} from './types';
// import type {ValidationError} from '@kr-modules/common/server-api/types/coda_http_errors';
import {ValueType} from '../schema';
import type {WebBasicAuthentication} from '../types';
import {assertCondition} from 'index';
import {isNil} from 'helpers/object_utils';
// import {assertCondition} from '@kr-modules/js-core/ensure/ensure';
// import {isNil} from '@kr-modules/js-core/utils/object_utils';
import stream from 'stream';
import * as streamHelper from '../helpers/stream_helper';
import * as z from 'zod';

export interface ParsedUpload {
  metadata: PackMetadata;
  rawBundleStream: stream.Readable;
}

export class PackUploadValidationError extends Error {
  readonly originalError: Error | undefined;
  readonly validationErrors: ValidationError[] | undefined;

  constructor(message: string, originalError?: Error, validationErrors?: ValidationError[]) {
    super(message);
    this.originalError = originalError;
    this.validationErrors = validationErrors;
  }
}

export async function validateAndParseUpload(untrustedUploadStream: stream.Readable): Promise<ParsedUpload> {
  const untrustedUploadStr = (await streamHelper.toBuffer(untrustedUploadStream)).toString();
  let rawUpload: any;
  try {
    rawUpload = JSON.parse(untrustedUploadStr);
  } catch (err) {
    throw new PackUploadValidationError(`Pack upload is not valid JSON.`, err);
  }
  if (typeof rawUpload !== 'object') {
    throw new PackUploadValidationError(`Pack upload is a ${typeof rawUpload} but should be a JSON object.`);
  }

  const validated = validateUpload(rawUpload);
  if (!validated.success) {
    throw new PackUploadValidationError(
      'Pack upload failed validation',
      validated.error,
      validated.error.errors.flatMap(zodErrorDetailToValidationError),
    );
  }

  return {
    metadata: validated.data.metadata,
    rawBundleStream: stream.Readable.from(validated.data.bundle),
  };
}

function validateUpload(obj: Record<string, any>) {
  return uploadSchema.safeParse(obj);
}

function zodErrorDetailToValidationError(subError: z.ZodIssue): ValidationError | ValidationError[] {
  // Top-level errors for union types are totally useless, they just say "invalid input",
  // but they do record all of the specific errors when trying each element of the union,
  // so we filter out the errors that were just due to non-matches of the discriminant
  // and bubble up the rest to the top level, we get actionable output.
  if (subError.code === z.ZodIssueCode.invalid_union) {
    const underlyingErrors: ValidationError[] = [];
    for (const unionError of subError.unionErrors) {
      const isNonmatchedUnionMember = unionError.issues.some(
        issue => issue.code === z.ZodIssueCode.invalid_literal_value,
      );
      // Skip any errors that are nested with an "invalid literal" error that is usually
      // a failed discriminant match; we don't care about reporting any errors from this union
      // member if the discriminant didn't match.
      if (isNonmatchedUnionMember) {
        continue;
      }
      for (const unionIssue of unionError.issues) {
        if (unionIssue.code !== z.ZodIssueCode.invalid_literal_value) {
          const error: ValidationError = {
            path: zodPathToPathString(unionIssue.path),
            message: unionIssue.message,
          };
          underlyingErrors.push(error);
        }
      }
    }
    return underlyingErrors;
  }

  const {path: zodPath, message} = subError;
  return {path: zodPathToPathString(zodPath), message};
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

type ZodUnionInput = [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]];

function zodUnionInput(schemas: z.ZodTypeAny[]): ZodUnionInput {
  assertCondition(schemas.length >= 2, 'A zod union type requires at least 2 options.');
  return schemas as ZodUnionInput;
}

const setEndpointPostSetupValidator = zodCompleteObject<SetEndpoint>({
  type: z.literal(PostSetupType.SetEndpoint),
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
  [AuthenticationType.None]: zodCompleteObject<NoAuthentication>({
    type: z.literal(AuthenticationType.None),
  }),
  [AuthenticationType.HeaderBearerToken]: zodCompleteObject<HeaderBearerTokenAuthentication>({
    type: z.literal(AuthenticationType.HeaderBearerToken),
    ...baseAuthenticationValidators,
  }),
  [AuthenticationType.CodaApiHeaderBearerToken]: zodCompleteObject<CodaApiBearerTokenAuthentication>({
    type: z.literal(AuthenticationType.CodaApiHeaderBearerToken),
    deferConnectionSetup: z.boolean().optional(),
    shouldAutoAuthSetup: z.boolean().optional(),
    ...baseAuthenticationValidators,
  }),
  [AuthenticationType.CustomHeaderToken]: zodCompleteObject<CustomHeaderTokenAuthentication>({
    type: z.literal(AuthenticationType.CustomHeaderToken),
    headerName: z.string(),
    tokenPrefix: z.string().optional(),
    ...baseAuthenticationValidators,
  }),
  [AuthenticationType.QueryParamToken]: zodCompleteObject<QueryParamTokenAuthentication>({
    type: z.literal(AuthenticationType.QueryParamToken),
    paramName: z.string(),
    ...baseAuthenticationValidators,
  }),
  [AuthenticationType.MultiQueryParamToken]: zodCompleteObject<MultiQueryParamTokenAuthentication>({
    type: z.literal(AuthenticationType.MultiQueryParamToken),
    params: z.array(
      zodCompleteObject<MultiQueryParamTokenAuthentication['params'][number]>({
        name: z.string(),
        description: z.string(),
      }),
    ),
    ...baseAuthenticationValidators,
  }),
  [AuthenticationType.OAuth2]: zodCompleteObject<OAuth2Authentication>({
    type: z.literal(AuthenticationType.OAuth2),
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
  [AuthenticationType.WebBasic]: zodCompleteObject<WebBasicAuthentication>({
    type: z.literal(AuthenticationType.WebBasic),
    uxConfig: zodCompleteObject<WebBasicAuthentication['uxConfig']>({
      placeholderUsername: z.string().optional(),
      placeholderPassword: z.string().optional(),
      usernameOnly: z.boolean().optional(),
    }),
    ...baseAuthenticationValidators,
  }),
  [AuthenticationType.AWSSignature4]: zodCompleteObject<AWSSignature4Authentication>({
    type: z.literal(AuthenticationType.AWSSignature4),
    service: z.string(),
    ...baseAuthenticationValidators,
  }),
};

// TODO(jonathan): Consider putting this in the SDK.
const systemAuthenticationTypes = Object.values(AuthenticationType).filter(
  authType =>
    ![AuthenticationType.None, AuthenticationType.CodaApiHeaderBearerToken, AuthenticationType.OAuth2].includes(
      authType,
    ),
);

const systemAuthenticationValidators = Object.entries(defaultAuthenticationValidators)
  .filter(([authType]) => systemAuthenticationTypes.includes(authType as AuthenticationType))
  .map(([_authType, schema]) => schema);

const primitiveUnion = z.union([z.number(), z.string(), z.boolean(), z.date()]);

const paramDefValidator = zodCompleteObject<ParamDef<any>>({
  name: z.string(),
  type: z.union([z.nativeEnum(Type), z.object({type: z.literal('array'), items: z.nativeEnum(Type)})]),
  description: z.string(),
  optional: z.boolean().optional(),
  hidden: z.boolean().optional(),
  autocomplete: z.unknown(),
  defaultValue: z.unknown(),
});

const commonPackFormulaSchema = {
  name: z.string(),
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
  resultType: z.literal(Type.number),
  schema: zodCompleteObject<NumberSchema>({
    type: z.literal(ValueType.Number),
    codaType: z.enum([...NumberHintValueTypes]).optional(),
    description: z.string().optional(),
  }).optional(),
});

const stringPackFormulaSchema = zodCompleteObject<Omit<StringPackFormula<any>, 'execute'>>({
  ...commonPackFormulaSchema,
  resultType: z.literal(Type.string),
  schema: zodCompleteObject<StringSchema>({
    type: z.literal(ValueType.String),
    codaType: z.enum([...StringHintValueTypes]).optional(),
    description: z.string().optional(),
  }).optional(),
});

// TODO(jonathan): Use zodCompleteObject on these after exporting these types.

const textAttributionNodeSchema = z.object({
  type: z.literal(AttributionNodeType.Text),
  text: z.string(),
});

const linkAttributionNodeSchema = z.object({
  type: z.literal(AttributionNodeType.Link),
  anchorUrl: z.string(),
  anchorText: z.string(),
});

const imageAttributionNodeSchema = z.object({
  type: z.literal(AttributionNodeType.Image),
  anchorUrl: z.string(),
  imageUrl: z.string(),
});

const basePropertyValidators = {
  description: z.string().optional(),
  fromKey: z.string().optional(),
  required: z.boolean().optional(),
};

const booleanPropertySchema = zodCompleteObject<BooleanSchema & ObjectSchemaProperty>({
  type: z.literal(ValueType.Boolean),
  ...basePropertyValidators,
});

const numberPropertySchema = zodCompleteObject<NumberSchema & ObjectSchemaProperty>({
  type: z.literal(ValueType.Number),
  codaType: z.enum([...NumberHintValueTypes]).optional(),
  ...basePropertyValidators,
});

const stringPropertySchema = zodCompleteObject<StringSchema & ObjectSchemaProperty>({
  type: z.literal(ValueType.String),
  codaType: z.enum([...StringHintValueTypes]).optional(),
  ...basePropertyValidators,
});

// TODO(jonathan): Give this a better type than ZodTypeAny after figuring out
// recurise typing better.
const arrayPropertySchema: z.ZodTypeAny = z.lazy(() =>
  zodCompleteObject<ArraySchema & ObjectSchemaProperty>({
    type: z.literal(ValueType.Array),
    items: objectPropertyUnionSchema,
    ...basePropertyValidators,
  }),
);

const genericObjectSchema: z.ZodTypeAny = z.lazy(() =>
  zodCompleteObject<ObjectSchema<any, any>>({
    type: z.literal(ValueType.Object),
    description: z.string().optional(),
    id: z.string().optional(),
    primary: z.string().optional(),
    codaType: z.enum([...ObjectHintValueTypes]).optional(),
    featured: z.array(z.string()).optional(),
    identity: zodCompleteObject<Identity>({
      packId: z.number(), // TODO: Remove
      name: z.string().nonempty(),
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
  resultType: z.literal(Type.object),
  // TODO(jonathan): See if we should really allow this. The SDK right now explicitly tolerates an undefined
  // schema for objects, but that doesn't seem like a use case we actually want to support.
  schema: genericObjectSchema.optional(),
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

const packMetadataSchema = zodCompleteObject<PackMetadata>({
  id: z.number().optional(), // Will be assigned by DB
  name: z.string().nonempty(),
  shortDescription: z.string().nonempty(),
  description: z.string().nonempty(),
  permissionsDescription: z.string().optional(), // TODO: validate present if authentication is present
  version: z.string().nonempty(),
  providerId: z.number().optional(), // Deprecated
  category: z.nativeEnum(PackCategory),
  logoPath: z.string().optional(),
  enabledConfigName: z.string().optional(),
  defaultAuthentication: z.union(zodUnionInput(Object.values(defaultAuthenticationValidators))).optional(),
  exampleImages: z.array(z.string()).optional(),
  exampleVideoIds: z.array(z.string()).optional(),
  minimumFeatureSet: z.nativeEnum(FeatureSet).optional(),
  quotas: z.any().optional(), // Moving to the UI
  rateLimits: z.any().optional(), // Moving to the UI
  formulaNamespace: z.string().optional(),
  systemConnectionAuthentication: z.union(zodUnionInput(systemAuthenticationValidators)).optional(),
  formulas: z.array(formulaMetadataSchema).optional().default([]),
  formats: z.array(formatMetadataSchema).optional().default([]),
  syncTables: z.array(z.unknown()).optional().default([]),
  isSystem: z.boolean().optional(), // Moving to UI/admin
})
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

const uploadSchema = zodCompleteObject<PackUpload>({
  metadata: packMetadataSchema,
  bundle: z.string().nonempty(),
});
