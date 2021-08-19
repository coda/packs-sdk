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
exports.validateSyncTableSchema = exports.validateVariousAuthenticationMetadata = exports.validatePackVersionMetadata = exports.PackMetadataValidationError = void 0;
const schema_1 = require("../schema");
const types_1 = require("../types");
const api_types_1 = require("../api_types");
const types_2 = require("../types");
const types_3 = require("../types");
const api_types_2 = require("../api_types");
const schema_2 = require("../schema");
const schema_3 = require("../schema");
const types_4 = require("../types");
const types_5 = require("../types");
const schema_4 = require("../schema");
const api_types_3 = require("../api_types");
const schema_5 = require("../schema");
const ensure_1 = require("../helpers/ensure");
const object_utils_1 = require("../helpers/object_utils");
const z = __importStar(require("zod"));
var CustomErrorCode;
(function (CustomErrorCode) {
    CustomErrorCode["NonMatchingDiscriminant"] = "nonMatchingDiscriminant";
})(CustomErrorCode || (CustomErrorCode = {}));
class PackMetadataValidationError extends Error {
    constructor(message, originalError, validationErrors) {
        super(message);
        this.originalError = originalError;
        this.validationErrors = validationErrors;
    }
}
exports.PackMetadataValidationError = PackMetadataValidationError;
async function validatePackVersionMetadata(metadata) {
    // For now we use legacyPackMetadataSchema as the top-level object we validate. As soon as we migrate all of our
    // first-party pack definitions to only use versioned fields, we can use packVersionMetadataSchema  here.
    const validated = legacyPackMetadataSchema.safeParse(metadata);
    if (!validated.success) {
        throw new PackMetadataValidationError('Pack metadata failed validation', validated.error, validated.error.errors.flatMap(zodErrorDetailToValidationError));
    }
    return validated.data;
}
exports.validatePackVersionMetadata = validatePackVersionMetadata;
// Note: This is called within Coda for validating user-provided authentication metadata
// as part of Various connections.
function validateVariousAuthenticationMetadata(auth) {
    const validated = z.union(zodUnionInput(variousSupportedAuthenticationValidators)).safeParse(auth);
    if (validated.success) {
        return auth;
    }
    throw new PackMetadataValidationError('Various authentication failed validation', validated.error, validated.error.errors.flatMap(zodErrorDetailToValidationError));
}
exports.validateVariousAuthenticationMetadata = validateVariousAuthenticationMetadata;
// Note: This is called within Coda for validating the result of getSchema calls for dynamic sync tables.
function validateSyncTableSchema(schema) {
    const validated = arrayPropertySchema.safeParse(schema);
    if (validated.success) {
        return validated.data;
    }
    throw new PackMetadataValidationError('Schema failed validation', validated.error, validated.error.errors.flatMap(zodErrorDetailToValidationError));
}
exports.validateSyncTableSchema = validateSyncTableSchema;
function getNonUniqueElements(items) {
    const set = new Set();
    const nonUnique = [];
    for (const item of items) {
        if (set.has(item)) {
            nonUnique.push(item);
        }
        set.add(item);
    }
    return nonUnique;
}
function zodErrorDetailToValidationError(subError) {
    var _a;
    // Top-level errors for union types are totally useless, they just say "invalid input",
    // but they do record all of the specific errors when trying each element of the union,
    // so we filter out the errors that were just due to non-matches of the discriminant
    // and bubble up the rest to the top level, we get actionable output.
    if (subError.code === z.ZodIssueCode.invalid_union) {
        const underlyingErrors = [];
        for (const unionError of subError.unionErrors) {
            const isNonmatchedUnionMember = unionError.issues.some(issue => {
                var _a;
                return (issue.code === z.ZodIssueCode.custom &&
                    ((_a = issue.params) === null || _a === void 0 ? void 0 : _a.customErrorCode) === CustomErrorCode.NonMatchingDiscriminant);
            });
            // Skip any errors that are nested with an "invalid literal" error that is usually
            // a failed discriminant match; we don't care about reporting any errors from this union
            // member if the discriminant didn't match.
            if (isNonmatchedUnionMember) {
                continue;
            }
            for (const unionIssue of unionError.issues) {
                const isDiscriminantError = unionIssue.code === z.ZodIssueCode.custom &&
                    ((_a = unionIssue.params) === null || _a === void 0 ? void 0 : _a.customErrorCode) === CustomErrorCode.NonMatchingDiscriminant;
                if (!isDiscriminantError) {
                    let errors;
                    if (unionIssue.code === z.ZodIssueCode.invalid_union) {
                        // Recurse to find the real error underlying any unions within child fields.
                        errors = zodErrorDetailToValidationError(unionIssue);
                    }
                    else {
                        const error = {
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
            return [{ path: zodPathToPathString(subError.path), message: 'Could not find any valid schema for this value.' }];
        }
        return underlyingErrors;
    }
    const { path: zodPath, message } = subError;
    const path = zodPathToPathString(zodPath);
    const isMissingRequiredFieldError = subError.code === z.ZodIssueCode.invalid_type &&
        subError.received === 'undefined' &&
        subError.expected.toString() !== 'undefined';
    return [
        {
            path,
            message: isMissingRequiredFieldError ? `Missing required field ${path}.` : message,
        },
    ];
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
function zodCompleteStrictObject(shape) {
    return z.strictObject(shape);
}
function zodDiscriminant(value) {
    return z.union([z.string(), z.number(), z.boolean(), z.undefined()]).refine(data => data === value, {
        message: 'Non-matching discriminant',
        params: { customErrorCode: CustomErrorCode.NonMatchingDiscriminant },
    });
}
function zodUnionInput(schemas) {
    ensure_1.assertCondition(schemas.length >= 2, 'A zod union type requires at least 2 options.');
    return schemas;
}
const setEndpointPostSetupValidator = zodCompleteObject({
    type: zodDiscriminant(types_5.PostSetupType.SetEndpoint),
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
    [types_1.AuthenticationType.None]: zodCompleteStrictObject({
        type: zodDiscriminant(types_1.AuthenticationType.None),
    }),
    [types_1.AuthenticationType.HeaderBearerToken]: zodCompleteStrictObject({
        type: zodDiscriminant(types_1.AuthenticationType.HeaderBearerToken),
        ...baseAuthenticationValidators,
    }),
    [types_1.AuthenticationType.CodaApiHeaderBearerToken]: zodCompleteStrictObject({
        type: zodDiscriminant(types_1.AuthenticationType.CodaApiHeaderBearerToken),
        deferConnectionSetup: z.boolean().optional(),
        shouldAutoAuthSetup: z.boolean().optional(),
        ...baseAuthenticationValidators,
    }),
    [types_1.AuthenticationType.CustomHeaderToken]: zodCompleteStrictObject({
        type: zodDiscriminant(types_1.AuthenticationType.CustomHeaderToken),
        headerName: z.string(),
        tokenPrefix: z.string().optional(),
        ...baseAuthenticationValidators,
    }),
    [types_1.AuthenticationType.QueryParamToken]: zodCompleteStrictObject({
        type: zodDiscriminant(types_1.AuthenticationType.QueryParamToken),
        paramName: z.string(),
        ...baseAuthenticationValidators,
    }),
    [types_1.AuthenticationType.MultiQueryParamToken]: zodCompleteStrictObject({
        type: zodDiscriminant(types_1.AuthenticationType.MultiQueryParamToken),
        params: z
            .array(zodCompleteStrictObject({
            name: z.string(),
            description: z.string(),
        }))
            .refine(params => {
            const keys = params.map(param => param.name);
            return keys.length === new Set(keys).size;
        }, { message: 'Duplicated parameter names in the mutli-query-token authentication config' }),
        ...baseAuthenticationValidators,
    }),
    [types_1.AuthenticationType.OAuth2]: zodCompleteStrictObject({
        type: zodDiscriminant(types_1.AuthenticationType.OAuth2),
        authorizationUrl: z.string(),
        tokenUrl: z.string(),
        scopes: z.array(z.string()).optional(),
        tokenPrefix: z.string().optional(),
        additionalParams: z.record(z.any()).optional(),
        endpointKey: z.string().optional(),
        tokenQueryParam: z.string().optional(),
        ...baseAuthenticationValidators,
    }),
    [types_1.AuthenticationType.WebBasic]: zodCompleteStrictObject({
        type: zodDiscriminant(types_1.AuthenticationType.WebBasic),
        uxConfig: zodCompleteStrictObject({
            placeholderUsername: z.string().optional(),
            placeholderPassword: z.string().optional(),
            usernameOnly: z.boolean().optional(),
        }).optional(),
        ...baseAuthenticationValidators,
    }),
    [types_1.AuthenticationType.AWSSignature4]: zodCompleteStrictObject({
        type: zodDiscriminant(types_1.AuthenticationType.AWSSignature4),
        service: z.string(),
        ...baseAuthenticationValidators,
    }),
    [types_1.AuthenticationType.Various]: zodCompleteStrictObject({
        type: zodDiscriminant(types_1.AuthenticationType.Various),
    }),
};
const systemAuthenticationTypes = {
    [types_1.AuthenticationType.HeaderBearerToken]: true,
    [types_1.AuthenticationType.CustomHeaderToken]: true,
    [types_1.AuthenticationType.MultiQueryParamToken]: true,
    [types_1.AuthenticationType.QueryParamToken]: true,
    [types_1.AuthenticationType.WebBasic]: true,
    [types_1.AuthenticationType.AWSSignature4]: true,
};
const systemAuthenticationValidators = Object.entries(defaultAuthenticationValidators)
    .filter(([authType]) => authType in systemAuthenticationTypes)
    .map(([_authType, schema]) => schema);
const variousSupportedAuthenticationTypes = {
    [types_1.AuthenticationType.HeaderBearerToken]: true,
    [types_1.AuthenticationType.CustomHeaderToken]: true,
    [types_1.AuthenticationType.MultiQueryParamToken]: true,
    [types_1.AuthenticationType.QueryParamToken]: true,
    [types_1.AuthenticationType.WebBasic]: true,
    [types_1.AuthenticationType.None]: true,
};
const variousSupportedAuthenticationValidators = Object.entries(defaultAuthenticationValidators)
    .filter(([authType]) => authType in variousSupportedAuthenticationTypes)
    .map(([_authType, schema]) => schema);
const primitiveUnion = z.union([z.number(), z.string(), z.boolean(), z.date()]);
const paramDefValidator = zodCompleteObject({
    name: z.string(),
    type: z
        .union([z.nativeEnum(api_types_3.Type), z.object({ type: zodDiscriminant('array'), items: z.nativeEnum(api_types_3.Type) })])
        .refine(paramType => paramType !== api_types_3.Type.object &&
        !(typeof paramType === 'object' && paramType.type === 'array' && paramType.items === api_types_3.Type.object), {
        message: 'Object parameters are not currently supported.',
    }),
    description: z.string(),
    optional: z.boolean().optional(),
    hidden: z.boolean().optional(),
    autocomplete: z.unknown(),
    defaultValue: z.unknown(),
});
const commonPackFormulaSchema = {
    name: z
        .string()
        .refine(validateFormulaName, { message: 'Formula names can only contain alphanumeric characters and underscores.' }),
    description: z.string(),
    examples: z
        .array(z.object({
        params: z.union([primitiveUnion, z.array(primitiveUnion)]),
        result: z.any(),
    }))
        .optional(),
    parameters: z.array(paramDefValidator).refine(params => {
        let hasOptional = false;
        for (const param of params) {
            if (param.optional) {
                hasOptional = true;
            }
            else if (!param.optional && hasOptional) {
                return false;
            }
        }
        return true;
    }, { message: 'All optional parameters must be come after all non-optional parameters.' }),
    varargParameters: z.array(paramDefValidator).optional(),
    isAction: z.boolean().optional(),
    connectionRequirement: z.nativeEnum(api_types_1.ConnectionRequirement).optional(),
    // TODO(jonathan): Remove after removing `network` from formula def.
    network: zodCompleteObject({
        hasSideEffect: z.boolean().optional(),
        requiresConnection: z.boolean().optional(),
        connection: z.nativeEnum(api_types_2.NetworkConnection).optional(),
    }).optional(),
    cacheTtlSecs: z.number().min(0).optional(),
    isExperimental: z.boolean().optional(),
    isSystem: z.boolean().optional(),
    extraOAuthScopes: z.array(z.string()).optional(),
};
const numericPackFormulaSchema = zodCompleteObject({
    ...commonPackFormulaSchema,
    resultType: zodDiscriminant(api_types_3.Type.number),
    schema: zodCompleteObject({
        type: zodDiscriminant(schema_5.ValueType.Number),
        codaType: z.enum([...schema_2.NumberHintValueTypes]).optional(),
        description: z.string().optional(),
    }).optional(),
});
const stringPackFormulaSchema = zodCompleteObject({
    ...commonPackFormulaSchema,
    resultType: zodDiscriminant(api_types_3.Type.string),
    schema: zodCompleteObject({
        type: zodDiscriminant(schema_5.ValueType.String),
        codaType: z.enum([...schema_4.StringHintValueTypes]).optional(),
        description: z.string().optional(),
    }).optional(),
});
const booleanPackFormulaSchema = zodCompleteObject({
    ...commonPackFormulaSchema,
    resultType: zodDiscriminant(api_types_3.Type.boolean),
    schema: zodCompleteObject({
        type: zodDiscriminant(schema_5.ValueType.Boolean),
        description: z.string().optional(),
    }).optional(),
});
// TODO(jonathan): Use zodCompleteObject on these after exporting these types.
const textAttributionNodeSchema = z.object({
    type: zodDiscriminant(schema_1.AttributionNodeType.Text),
    text: z.string(),
});
const linkAttributionNodeSchema = z.object({
    type: zodDiscriminant(schema_1.AttributionNodeType.Link),
    anchorUrl: z.string(),
    anchorText: z.string(),
});
const imageAttributionNodeSchema = z.object({
    type: zodDiscriminant(schema_1.AttributionNodeType.Image),
    anchorUrl: z.string(),
    imageUrl: z.string(),
});
const basePropertyValidators = {
    description: z.string().optional(),
    fromKey: z.string().optional(),
    required: z.boolean().optional(),
};
const booleanPropertySchema = zodCompleteObject({
    type: zodDiscriminant(schema_5.ValueType.Boolean),
    ...basePropertyValidators,
});
const numberPropertySchema = zodCompleteObject({
    type: zodDiscriminant(schema_5.ValueType.Number),
    codaType: z.enum([...schema_2.NumberHintValueTypes]).optional(),
    ...basePropertyValidators,
});
const stringPropertySchema = zodCompleteObject({
    type: zodDiscriminant(schema_5.ValueType.String),
    codaType: z.enum([...schema_4.StringHintValueTypes]).optional(),
    ...basePropertyValidators,
});
// TODO(jonathan): Give this a better type than ZodTypeAny after figuring out
// recurise typing better.
const arrayPropertySchema = z.lazy(() => zodCompleteObject({
    type: zodDiscriminant(schema_5.ValueType.Array),
    items: objectPropertyUnionSchema,
    ...basePropertyValidators,
}));
const Base64ObjectRegex = /^[A-Za-z0-9=_-]+$/;
// This is ripped off from isValidObjectId in coda. Violating this causes a number of downstream headaches.
function isValidObjectId(component) {
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
function isValidIdentityName(name) {
    if (BAD_SYNC_TABLE_NAMES.includes(name)) {
        return true;
    }
    return isValidObjectId(name);
}
const genericObjectSchema = z.lazy(() => zodCompleteObject({
    ...basePropertyValidators,
    type: zodDiscriminant(schema_5.ValueType.Object),
    description: z.string().optional(),
    id: z.string().optional(),
    primary: z.string().optional(),
    codaType: z.enum([...schema_3.ObjectHintValueTypes]).optional(),
    featured: z.array(z.string()).optional(),
    identity: zodCompleteObject({
        // Stupid hack to hardcode a pack id that will get replaced at upload time.
        // TODO(jonathan): Enable after existing packs go through the v2 upload flow.
        // packId: z.literal(PlaceholderIdentityPackId),
        packId: z.number().optional(),
        name: z.string().nonempty().refine(isValidIdentityName, {
            message: 'Invalid name. Identity names can only contain alphanumeric characters, underscores, and dashes, and no spaces.',
        }),
        dynamicUrl: z.string().optional(),
        attribution: z
            .array(z.union([textAttributionNodeSchema, linkAttributionNodeSchema, imageAttributionNodeSchema]))
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
    .superRefine((data, context) => {
    (data.featured || []).forEach((f, i) => {
        if (!(f in data.properties)) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['featured', i],
                message: `The featured field name "${f}" does not exist in the "properties" object.`,
            });
        }
    });
}));
const objectPropertyUnionSchema = z.union([
    booleanPropertySchema,
    numberPropertySchema,
    stringPropertySchema,
    arrayPropertySchema,
    genericObjectSchema,
]);
const objectPackFormulaSchema = zodCompleteObject({
    ...commonPackFormulaSchema,
    resultType: zodDiscriminant(api_types_3.Type.object),
    // TODO(jonathan): See if we should really allow this. The SDK right now explicitly tolerates an undefined
    // schema for objects, but that doesn't seem like a use case we actually want to support.
    schema: z.union([genericObjectSchema, arrayPropertySchema]).optional(),
});
const formulaMetadataSchema = z.union([
    numericPackFormulaSchema,
    stringPackFormulaSchema,
    booleanPackFormulaSchema,
    objectPackFormulaSchema,
]);
const formatMetadataSchema = zodCompleteObject({
    name: z.string(),
    formulaNamespace: z.string(),
    formulaName: z.string(),
    hasNoConnection: z.boolean().optional(),
    instructions: z.string().optional(),
    placeholder: z.string().optional(),
    matchers: z.array(z.string()),
});
const syncFormulaSchema = zodCompleteObject({
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
const genericSyncTableSchema = zodCompleteObject({
    ...baseSyncTableSchema,
    // Add a fake discriminant here so that we can flag union errors as related to a non-matching discriminant
    // and filter them out. A real regular sync table wouldn't specify `isDynamic` at all here, but including
    // it in the validator like this helps zod flag it in the way we need.
    isDynamic: zodDiscriminant(false).optional(),
    getSchema: formulaMetadataSchema.optional(),
}).strict();
const genericDynamicSyncTableSchema = zodCompleteObject({
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
const unrefinedPackVersionMetadataSchema = zodCompleteObject({
    version: z
        .string()
        .regex(/^\d+(\.\d+){0,2}$/, 'Pack versions must use semantic versioning, e.g. "1", "1.0" or "1.0.0".'),
    defaultAuthentication: z.union(zodUnionInput(Object.values(defaultAuthenticationValidators))).optional(),
    networkDomains: z
        .array(z.string().refine(domain => !(domain.startsWith('http:') || domain.startsWith('https:')), {
        message: 'Invalid network domain. Instead of "https://www.example.com", just specify "example.com".',
    }))
        .optional(),
    formulaNamespace: z.string().optional().refine(validateNamespace, {
        message: 'Formula namespaces can only contain alphanumeric characters and underscores.',
    }),
    systemConnectionAuthentication: z.union(zodUnionInput(systemAuthenticationValidators)).optional(),
    formulas: z.array(formulaMetadataSchema).optional().default([]),
    formats: z.array(formatMetadataSchema).optional().default([]),
    syncTables: z
        .array(syncTableSchema)
        .optional()
        .default([])
        .superRefine((data, context) => {
        const identityNames = data.map(tableDef => tableDef.schema.identity.name);
        for (const dupe of getNonUniqueElements(identityNames)) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Sync table identity names must be unique. Found duplicate name "${dupe}".`,
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
});
// The following largely copied from tokens.ts for parsing formula names.
const letterChar = String.raw `\p{L}`;
const numberChar = String.raw `\p{N}`;
const wordChar = String.raw `${letterChar}${numberChar}_`;
const regexLetterChar = String.raw `[${letterChar}]`;
const regexWordChar = String.raw `[${wordChar}]`;
const regexFormulaNameStr = String.raw `^${regexLetterChar}(?:${regexWordChar}+)?$`;
const regexFormulaName = new RegExp(regexFormulaNameStr, 'u');
function validateNamespace(namespace) {
    if (typeof namespace === 'undefined') {
        return true;
    }
    return validateFormulaName(namespace);
}
function validateFormulaName(value) {
    return regexFormulaName.test(value);
}
function validateFormulas(schema) {
    return schema
        .refine(data => {
        if (data.formulas && data.formulas.length > 0) {
            return data.formulaNamespace;
        }
        return true;
    }, { message: 'A formula namespace must be provided whenever formulas are defined.', path: ['formulaNamespace'] })
        .superRefine((data, context) => {
        const formulas = (data.formulas || []);
        (data.formats || []).forEach((format, i) => {
            var _a;
            const formula = formulas.find(f => f.name === format.formulaName);
            if (!formula) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['formats', i],
                    message: 'Could not find a formula definition for this format. Each format must reference the name of a formula defined in this pack.',
                });
            }
            else {
                let hasError = !((_a = formula.parameters) === null || _a === void 0 ? void 0 : _a.length);
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
    });
}
// We temporarily allow our legacy packs to provide non-versioned data until we sufficiently migrate them.
// But all fields must be optional, because this is the top-level object we use for validation,
// so we must be able to pass validation while providing only fields from PackVersionMetadata.
const legacyPackMetadataSchema = validateFormulas(unrefinedPackVersionMetadataSchema.extend({
    id: z.number().optional(),
    name: z.string().nonempty().optional(),
    shortDescription: z.string().nonempty().optional(),
    description: z.string().nonempty().optional(),
    permissionsDescription: z.string().optional(),
    category: z.nativeEnum(types_4.PackCategory).optional(),
    logoPath: z.string().optional(),
    enabledConfigName: z.string().optional(),
    exampleImages: z.array(z.string()).optional(),
    exampleVideoIds: z.array(z.string()).optional(),
    minimumFeatureSet: z.nativeEnum(types_3.FeatureSet).optional(),
    quotas: z.any().optional(),
    rateLimits: z.any().optional(),
    isSystem: z.boolean().optional(),
}))
    .superRefine((data, context) => {
    (data.syncTables || []).forEach((syncTable, i) => {
        var _a;
        if (!((_a = syncTable.schema) === null || _a === void 0 ? void 0 : _a.identity)) {
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
    .refine(data => {
    var _a, _b;
    const usesAuthentication = (data.defaultAuthentication && data.defaultAuthentication.type !== types_1.AuthenticationType.None) ||
        data.systemConnectionAuthentication;
    if (!usesAuthentication || ((_a = data.networkDomains) === null || _a === void 0 ? void 0 : _a.length)) {
        return true;
    }
    // Various is an internal authentication type that's only applicable to whitelisted Pack Ids.
    // Skipping validation here to let it exempt from network domains.
    if (((_b = data.defaultAuthentication) === null || _b === void 0 ? void 0 : _b.type) === types_1.AuthenticationType.Various) {
        return true;
    }
    return false;
}, {
    message: 'This pack uses authentication but did not declare a network domain. ' +
        "Specify the domain that your pack makes http requests to using `networkDomains: ['example.com']`",
    path: ['networkDomains'],
});
