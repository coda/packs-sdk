"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePackMetadata = exports.PackMetadataValidationError = void 0;
const schema_1 = require("../schema");
const types_1 = require("../types");
const types_2 = require("../types");
const types_3 = require("../types");
const schema_2 = require("../schema");
const schema_3 = require("../schema");
const types_4 = require("../types");
const types_5 = require("../types");
const schema_4 = require("../schema");
const index_1 = require("../index");
const schema_5 = require("../schema");
const ZodParsedType_1 = require("zod/lib/cjs/ZodParsedType");
const index_2 = require("../index");
const object_utils_1 = require("../helpers/object_utils");
const z = __importStar(require("zod"));
class PackMetadataValidationError extends Error {
    constructor(message, originalError, validationErrors) {
        super(message);
        this.originalError = originalError;
        this.validationErrors = validationErrors;
    }
}
exports.PackMetadataValidationError = PackMetadataValidationError;
async function validatePackMetadata(metadata) {
    const validated = packMetadataSchema.safeParse(metadata);
    if (!validated.success) {
        throw new PackMetadataValidationError('Pack metadata failed validation', validated.error, validated.error.errors.flatMap(zodErrorDetailToValidationError));
    }
    return validated.data;
}
exports.validatePackMetadata = validatePackMetadata;
function zodErrorDetailToValidationError(subError) {
    // Top-level errors for union types are totally useless, they just say "invalid input",
    // but they do record all of the specific errors when trying each element of the union,
    // so we filter out the errors that were just due to non-matches of the discriminant
    // and bubble up the rest to the top level, we get actionable output.
    if (subError.code === z.ZodIssueCode.invalid_union) {
        const underlyingErrors = [];
        for (const unionError of subError.unionErrors) {
            const isNonmatchedUnionMember = unionError.issues.some(issue => issue.code === z.ZodIssueCode.invalid_literal_value);
            // Skip any errors that are nested with an "invalid literal" error that is usually
            // a failed discriminant match; we don't care about reporting any errors from this union
            // member if the discriminant didn't match.
            if (isNonmatchedUnionMember) {
                continue;
            }
            for (const unionIssue of unionError.issues) {
                if (unionIssue.code !== z.ZodIssueCode.invalid_literal_value) {
                    const error = {
                        path: zodPathToPathString(unionIssue.path),
                        message: unionIssue.message,
                    };
                    underlyingErrors.push(error);
                }
            }
        }
        return underlyingErrors;
    }
    const { path: zodPath, message } = subError;
    const path = zodPathToPathString(zodPath);
    const isMissingRequiredFieldError = subError.code === z.ZodIssueCode.invalid_type &&
        subError.received === ZodParsedType_1.ZodParsedType.undefined &&
        subError.expected.toString() !== ZodParsedType_1.ZodParsedType.undefined;
    return {
        path,
        message: isMissingRequiredFieldError ? `Missing required field ${path}.` : message,
    };
}
function zodPathToPathString(zodPath) {
    const parts = [];
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
function zodCompleteObject(shape) {
    return z.object(shape);
}
function zodUnionInput(schemas) {
    index_2.assertCondition(schemas.length >= 2, 'A zod union type requires at least 2 options.');
    return schemas;
}
const setEndpointPostSetupValidator = zodCompleteObject({
    type: z.literal(types_5.PostSetupType.SetEndpoint),
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
    defaultConnectionType: z.nativeEnum(types_2.DefaultConnectionType).optional(),
    instructionsUrl: z.string().optional(),
    requiresEndpointUrl: z.boolean().optional(),
    endpointDomain: z.string().optional(),
    // The items are technically a discriminated union type but that union currently only has one member.
    postSetup: z.array(setEndpointPostSetupValidator).optional(),
};
const defaultAuthenticationValidators = {
    [types_1.AuthenticationType.None]: zodCompleteObject({
        type: z.literal(types_1.AuthenticationType.None),
    }),
    [types_1.AuthenticationType.HeaderBearerToken]: zodCompleteObject({
        type: z.literal(types_1.AuthenticationType.HeaderBearerToken),
        ...baseAuthenticationValidators,
    }),
    [types_1.AuthenticationType.CodaApiHeaderBearerToken]: zodCompleteObject({
        type: z.literal(types_1.AuthenticationType.CodaApiHeaderBearerToken),
        deferConnectionSetup: z.boolean().optional(),
        shouldAutoAuthSetup: z.boolean().optional(),
        ...baseAuthenticationValidators,
    }),
    [types_1.AuthenticationType.CustomHeaderToken]: zodCompleteObject({
        type: z.literal(types_1.AuthenticationType.CustomHeaderToken),
        headerName: z.string(),
        tokenPrefix: z.string().optional(),
        ...baseAuthenticationValidators,
    }),
    [types_1.AuthenticationType.QueryParamToken]: zodCompleteObject({
        type: z.literal(types_1.AuthenticationType.QueryParamToken),
        paramName: z.string(),
        ...baseAuthenticationValidators,
    }),
    [types_1.AuthenticationType.MultiQueryParamToken]: zodCompleteObject({
        type: z.literal(types_1.AuthenticationType.MultiQueryParamToken),
        params: z.array(zodCompleteObject({
            name: z.string(),
            description: z.string(),
        })),
        ...baseAuthenticationValidators,
    }),
    [types_1.AuthenticationType.OAuth2]: zodCompleteObject({
        type: z.literal(types_1.AuthenticationType.OAuth2),
        authorizationUrl: z.string(),
        tokenUrl: z.string(),
        scopes: z.array(z.string()).optional(),
        tokenPrefix: z.string().optional(),
        additionalParams: z.record(z.any()).optional(),
        clientIdEnvVarName: z.string().optional(),
        clientSecretEnvVarName: z.string().optional(),
        endpointKey: z.string().optional(),
        tokenQueryParam: z.string().optional(),
        ...baseAuthenticationValidators,
    }),
    [types_1.AuthenticationType.WebBasic]: zodCompleteObject({
        type: z.literal(types_1.AuthenticationType.WebBasic),
        uxConfig: zodCompleteObject({
            placeholderUsername: z.string().optional(),
            placeholderPassword: z.string().optional(),
            usernameOnly: z.boolean().optional(),
        }),
        ...baseAuthenticationValidators,
    }),
    [types_1.AuthenticationType.AWSSignature4]: zodCompleteObject({
        type: z.literal(types_1.AuthenticationType.AWSSignature4),
        service: z.string(),
        ...baseAuthenticationValidators,
    }),
};
// TODO(jonathan): Consider putting this in the SDK.
const systemAuthenticationTypes = Object.values(types_1.AuthenticationType).filter(authType => ![types_1.AuthenticationType.None, types_1.AuthenticationType.CodaApiHeaderBearerToken, types_1.AuthenticationType.OAuth2].includes(authType));
const systemAuthenticationValidators = Object.entries(defaultAuthenticationValidators)
    .filter(([authType]) => systemAuthenticationTypes.includes(authType))
    .map(([_authType, schema]) => schema);
const primitiveUnion = z.union([z.number(), z.string(), z.boolean(), z.date()]);
const paramDefValidator = zodCompleteObject({
    name: z.string(),
    type: z.union([z.nativeEnum(index_1.Type), z.object({ type: z.literal('array'), items: z.nativeEnum(index_1.Type) })]),
    description: z.string(),
    optional: z.boolean().optional(),
    hidden: z.boolean().optional(),
    autocomplete: z.unknown(),
    defaultValue: z.unknown(),
});
const commonPackFormulaSchema = {
    name: z.string(),
    description: z.string(),
    examples: z.array(z.object({
        params: z.union([primitiveUnion, z.array(primitiveUnion)]),
        result: z.any(),
    })),
    parameters: z.array(paramDefValidator),
    varargParameters: z.array(paramDefValidator).optional(),
    network: zodCompleteObject({
        hasSideEffect: z.boolean().optional(),
        requiresConnection: z.boolean().optional(),
    }).optional(),
    cacheTtlSecs: z.number().min(0).optional(),
    isExperimental: z.boolean().optional(),
    isSystem: z.boolean().optional(),
};
const numericPackFormulaSchema = zodCompleteObject({
    ...commonPackFormulaSchema,
    resultType: z.literal(index_1.Type.number),
    schema: zodCompleteObject({
        type: z.literal(schema_5.ValueType.Number),
        codaType: z.enum([...schema_2.NumberHintValueTypes]).optional(),
        description: z.string().optional(),
    }).optional(),
});
const stringPackFormulaSchema = zodCompleteObject({
    ...commonPackFormulaSchema,
    resultType: z.literal(index_1.Type.string),
    schema: zodCompleteObject({
        type: z.literal(schema_5.ValueType.String),
        codaType: z.enum([...schema_4.StringHintValueTypes]).optional(),
        description: z.string().optional(),
    }).optional(),
});
// TODO(jonathan): Use zodCompleteObject on these after exporting these types.
const textAttributionNodeSchema = z.object({
    type: z.literal(schema_1.AttributionNodeType.Text),
    text: z.string(),
});
const linkAttributionNodeSchema = z.object({
    type: z.literal(schema_1.AttributionNodeType.Link),
    anchorUrl: z.string(),
    anchorText: z.string(),
});
const imageAttributionNodeSchema = z.object({
    type: z.literal(schema_1.AttributionNodeType.Image),
    anchorUrl: z.string(),
    imageUrl: z.string(),
});
const basePropertyValidators = {
    description: z.string().optional(),
    fromKey: z.string().optional(),
    required: z.boolean().optional(),
};
const booleanPropertySchema = zodCompleteObject({
    type: z.literal(schema_5.ValueType.Boolean),
    ...basePropertyValidators,
});
const numberPropertySchema = zodCompleteObject({
    type: z.literal(schema_5.ValueType.Number),
    codaType: z.enum([...schema_2.NumberHintValueTypes]).optional(),
    ...basePropertyValidators,
});
const stringPropertySchema = zodCompleteObject({
    type: z.literal(schema_5.ValueType.String),
    codaType: z.enum([...schema_4.StringHintValueTypes]).optional(),
    ...basePropertyValidators,
});
// TODO(jonathan): Give this a better type than ZodTypeAny after figuring out
// recurise typing better.
const arrayPropertySchema = z.lazy(() => zodCompleteObject({
    type: z.literal(schema_5.ValueType.Array),
    items: objectPropertyUnionSchema,
    ...basePropertyValidators,
}));
const genericObjectSchema = z.lazy(() => zodCompleteObject({
    type: z.literal(schema_5.ValueType.Object),
    description: z.string().optional(),
    id: z.string().optional(),
    primary: z.string().optional(),
    codaType: z.enum([...schema_3.ObjectHintValueTypes]).optional(),
    featured: z.array(z.string()).optional(),
    identity: zodCompleteObject({
        packId: z.number(),
        name: z.string().nonempty(),
        dynamicUrl: z.string().optional(),
        attribution: z
            .union([textAttributionNodeSchema, linkAttributionNodeSchema, imageAttributionNodeSchema])
            .optional(),
    }).optional(),
    properties: z.record(objectPropertyUnionSchema),
})
    .refine(data => object_utils_1.isNil(data.id) || data.id in data.properties, {
    message: 'The "id" property must appear as a key in the "properties" object.',
})
    .refine(data => object_utils_1.isNil(data.primary) || data.primary in data.properties, {
    message: 'The "primary" property must appear as a key in the "properties" object.',
})
    .refine(data => {
    for (const f of data.featured || []) {
        if (!(f in data.properties)) {
            return false;
        }
    }
    return true;
}, { message: 'One or more of the "featured" fields do not appear in the "properties" object.' }));
const objectPropertyUnionSchema = z.union([
    booleanPropertySchema,
    numberPropertySchema,
    stringPropertySchema,
    arrayPropertySchema,
    genericObjectSchema,
]);
const objectPackFormulaSchema = zodCompleteObject({
    ...commonPackFormulaSchema,
    resultType: z.literal(index_1.Type.object),
    // TODO(jonathan): See if we should really allow this. The SDK right now explicitly tolerates an undefined
    // schema for objects, but that doesn't seem like a use case we actually want to support.
    schema: genericObjectSchema.optional(),
});
const formulaMetadataSchema = z.union([numericPackFormulaSchema, stringPackFormulaSchema, objectPackFormulaSchema]);
const formatMetadataSchema = zodCompleteObject({
    name: z.string(),
    formulaNamespace: z.string(),
    formulaName: z.string(),
    hasNoConnection: z.boolean().optional(),
    instructions: z.string().optional(),
    logoPath: z.string().optional(),
    placeholder: z.string().optional(),
    matchers: z.array(z.string()),
});
const packMetadataSchema = zodCompleteObject({
    id: z.number().optional(),
    name: z.string().nonempty(),
    shortDescription: z.string().nonempty(),
    description: z.string().nonempty(),
    permissionsDescription: z.string().optional(),
    version: z.string().nonempty(),
    providerId: z.number().optional(),
    category: z.nativeEnum(types_4.PackCategory),
    logoPath: z.string().optional(),
    enabledConfigName: z.string().optional(),
    defaultAuthentication: z.union(zodUnionInput(Object.values(defaultAuthenticationValidators))).optional(),
    exampleImages: z.array(z.string()).optional(),
    exampleVideoIds: z.array(z.string()).optional(),
    minimumFeatureSet: z.nativeEnum(types_3.FeatureSet).optional(),
    quotas: z.any().optional(),
    rateLimits: z.any().optional(),
    formulaNamespace: z.string().optional(),
    systemConnectionAuthentication: z.union(zodUnionInput(systemAuthenticationValidators)).optional(),
    formulas: z.array(formulaMetadataSchema).optional().default([]),
    formats: z.array(formatMetadataSchema).optional().default([]),
    syncTables: z.array(z.unknown()).optional().default([]),
    isSystem: z.boolean().optional(),
})
    .refine(data => {
    if (data.formulas && data.formulas.length > 0) {
        return data.formulaNamespace;
    }
    return true;
}, { message: 'A formula namespace must be provided whenever formulas are defined.', path: ['formulaNamespace'] })
    .refine(data => {
    const formulas = (data.formulas || []);
    const formulaNames = new Set(formulas.map(f => f.name));
    for (const format of data.formats || []) {
        if (!formulaNames.has(format.formulaName)) {
            return false;
        }
    }
    return true;
}, {
    // Annoying that the we can't be more precise and identify in the message which format had the issue;
    // these error messages are static.
    message: 'Could not find a formula for one or more matchers. Check that the "formulaName" for each matcher ' +
        'matches the name of a formula defined in this pack.',
    path: ['formats'],
});
