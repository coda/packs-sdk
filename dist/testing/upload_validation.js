"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodErrorDetailToValidationError = exports.validateSyncTableSchema = exports.validateVariousAuthenticationMetadata = exports.validatePackVersionMetadata = exports.PackMetadataValidationError = exports.Limits = exports.PACKS_VALID_COLUMN_FORMAT_MATCHER_REGEX = void 0;
const schema_1 = require("../schema");
const types_1 = require("../types");
const schema_2 = require("../schema");
const api_types_1 = require("../api_types");
const schema_3 = require("../schema");
const schema_4 = require("../schema");
const schema_5 = require("../schema");
const types_2 = require("../types");
const schema_6 = require("../schema");
const schema_7 = require("../schema");
const jsonpath_plus_1 = require("jsonpath-plus");
const schema_8 = require("../schema");
const api_types_2 = require("../api_types");
const schema_9 = require("../schema");
const api_types_3 = require("../api_types");
const types_3 = require("../types");
const types_4 = require("../types");
const schema_10 = require("../schema");
const schema_11 = require("../schema");
const types_5 = require("../types");
const api_types_4 = require("../api_types");
const schema_12 = require("../schema");
const schema_13 = require("../schema");
const zod_1 = require("zod");
const ensure_1 = require("../helpers/ensure");
const ensure_2 = require("../helpers/ensure");
const schema_14 = require("../schema");
const object_utils_1 = require("../helpers/object_utils");
const object_utils_2 = require("../helpers/object_utils");
const schema_15 = require("../schema");
const schema_16 = require("../schema");
const schema_17 = require("../schema");
const schema_18 = require("../schema");
const schema_19 = require("../schema");
const migration_1 = require("../helpers/migration");
const semver_1 = __importDefault(require("semver"));
const schema_20 = require("../schema");
const z = __importStar(require("zod"));
/**
 * The uncompiled column format matchers will be expected to be actual regex objects,
 * and when we compile the pack / stringify it to json, we will store the .toString()
 * of those regex objects. This regex is used to hydrate the stringified regex back into
 * a real RegExp object.
 */
exports.PACKS_VALID_COLUMN_FORMAT_MATCHER_REGEX = /^\/(.*)\/([a-z]+)?$/;
// The following largely copied from tokens.ts for parsing formula names.
const letterChar = String.raw `\p{L}`;
const numberChar = String.raw `\p{N}`;
const wordChar = String.raw `${letterChar}${numberChar}_`;
const regexLetterChar = String.raw `[${letterChar}]`;
const regexWordChar = String.raw `[${wordChar}]`;
const regexFormulaNameStr = String.raw `^${regexLetterChar}(?:${regexWordChar}+)?$`;
const regexFormulaName = new RegExp(regexFormulaNameStr, 'u');
// This is currently the same as the tokenizer's restrictions except stricter
// because we don't allow leading underscores.
const regexParameterName = regexFormulaName;
exports.Limits = {
    BuildingBlockCountPerType: 100,
    BuildingBlockName: 50,
    BuildingBlockDescription: 1000,
    ColumnMatcherRegex: 300,
    NumColumnMatchersPerFormat: 10,
    NetworkDomainUrl: 253,
    UpdateBatchSize: 1000,
};
var CustomErrorCode;
(function (CustomErrorCode) {
    CustomErrorCode["NonMatchingDiscriminant"] = "nonMatchingDiscriminant";
})(CustomErrorCode || (CustomErrorCode = {}));
class PackMetadataValidationError extends Error {
    constructor(message, originalError, validationErrors) {
        super(`${message}: ${JSON.stringify(validationErrors)}`.slice(0, 4096));
        this.originalError = originalError;
        this.validationErrors = validationErrors;
    }
}
exports.PackMetadataValidationError = PackMetadataValidationError;
async function validatePackVersionMetadata(metadata, sdkVersion, { warningMode } = {}) {
    const { legacyPackMetadataSchema } = buildMetadataSchema({ sdkVersion, warningMode });
    let combinedSchema = legacyPackMetadataSchema;
    // Server-side validation may be running a different SDK version than the pack maker
    // is using, so some breaking changes to metadata validation can be set up to only
    // take effect before or after an SDK version bump.
    if (sdkVersion) {
        for (const { versionRange, schemaExtend } of packMetadataSchemaBySdkVersion) {
            if (warningMode || semver_1.default.satisfies(sdkVersion, versionRange)) {
                combinedSchema = schemaExtend(combinedSchema);
            }
        }
    }
    // For now we use legacyPackMetadataSchema as the top-level object we validate. As soon as we migrate all of our
    // first-party pack definitions to only use versioned fields, we can use packVersionMetadataSchema  here.
    const validated = combinedSchema.safeParse(metadata);
    if (!validated.success) {
        throw new PackMetadataValidationError('Pack metadata failed validation', validated.error, validated.error.errors.flatMap(zodErrorDetailToValidationError));
    }
    return validated.data;
}
exports.validatePackVersionMetadata = validatePackVersionMetadata;
// Note: This is called within Coda for validating user-provided authentication metadata
// as part of Various connections.
function validateVariousAuthenticationMetadata(auth, options) {
    const { variousSupportedAuthenticationValidators } = buildMetadataSchema(options);
    const validated = z.union(zodUnionInput(variousSupportedAuthenticationValidators)).safeParse(auth);
    if (validated.success) {
        return auth;
    }
    throw new PackMetadataValidationError('Various authentication failed validation', validated.error, validated.error.errors.flatMap(zodErrorDetailToValidationError));
}
exports.validateVariousAuthenticationMetadata = validateVariousAuthenticationMetadata;
// Note: This is called within Coda for validating the result of getSchema calls for dynamic sync tables.
function validateSyncTableSchema(schema, options) {
    const { arrayPropertySchema } = buildMetadataSchema(options);
    const validated = arrayPropertySchema.safeParse(schema);
    if (validated.success) {
        return validated.data;
    }
    // In case this was an ObjectSchema (describing a single row), wrap it up as an ArraySchema.
    const syntheticArraySchema = (0, schema_16.makeSchema)({
        type: schema_13.ValueType.Array,
        items: schema,
    });
    const validatedAsObjectSchema = arrayPropertySchema.safeParse(syntheticArraySchema);
    if (validatedAsObjectSchema.success) {
        return validatedAsObjectSchema.data;
    }
    throw new PackMetadataValidationError('Schema failed validation', validated.error, validated.error.errors.flatMap(zodErrorDetailToValidationError));
}
exports.validateSyncTableSchema = validateSyncTableSchema;
function getNonUniqueElements(items) {
    const set = new Set();
    const nonUnique = [];
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
exports.zodErrorDetailToValidationError = zodErrorDetailToValidationError;
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
    return z.union([z.string(), z.number(), z.boolean(), z.undefined()]).superRefine((data, context) => {
        if (data !== value) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Non-matching discriminant',
                params: { customErrorCode: CustomErrorCode.NonMatchingDiscriminant },
                fatal: true,
            });
        }
    });
}
function zodUnionInput(schemas) {
    (0, ensure_1.assertCondition)(schemas.length >= 2, 'A zod union type requires at least 2 options.');
    return schemas;
}
const setEndpointPostSetupValidator = zodCompleteObject({
    type: zodDiscriminant(types_4.PostSetupType.SetEndpoint),
    name: z.string(),
    description: z.string(),
    // TODO(jonathan): Remove this from the metadata object, only needs to be present in the full bundle.
    getOptions: z.unknown().optional(),
    getOptionsFormula: z.unknown().optional(),
}).refine(data => data.getOptions || data.getOptionsFormula, 'Either getOptions or getOptionsFormula must be specified.');
function buildMetadataSchema({ sdkVersion }) {
    const singleAuthDomainSchema = z
        .string()
        .nonempty()
        .refine(domain => domain.indexOf(' ') < 0, {
        message: 'The `networkDomain` in setUserAuthentication() cannot contain spaces. Use an array for multiple domains.',
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
        [types_1.AuthenticationType.MultiHeaderToken]: zodCompleteStrictObject({
            type: zodDiscriminant(types_1.AuthenticationType.MultiHeaderToken),
            headers: z
                .array(zodCompleteStrictObject({
                name: z.string(),
                description: z.string(),
                tokenPrefix: z.string().optional(),
            }))
                .refine(headers => {
                const keys = headers.map(header => header.name.toLowerCase());
                return keys.length === new Set(keys).size;
            }, { message: 'Duplicated header names in the MultiHeaderToken authentication config' }),
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
            }, { message: 'Duplicated parameter names in the MultiQueryParamToken authentication config' }),
            ...baseAuthenticationValidators,
        }),
        [types_1.AuthenticationType.OAuth2]: zodCompleteStrictObject({
            type: zodDiscriminant(types_1.AuthenticationType.OAuth2),
            authorizationUrl: z.string().url(),
            tokenUrl: z.string().url(),
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
            credentialsLocation: z.nativeEnum(types_5.TokenExchangeCredentialsLocation).optional(),
            ...baseAuthenticationValidators,
        }),
        [types_1.AuthenticationType.OAuth2ClientCredentials]: zodCompleteStrictObject({
            type: zodDiscriminant(types_1.AuthenticationType.OAuth2ClientCredentials),
            tokenUrl: z.string().url(),
            scopes: z.array(z.string()).optional(),
            scopeDelimiter: z.enum([' ', ',', ';']).optional(),
            tokenPrefix: z.string().optional(),
            tokenQueryParam: z.string().optional(),
            scopeParamName: z.string().optional(),
            nestedResponseKey: z.string().optional(),
            credentialsLocation: z.nativeEnum(types_5.TokenExchangeCredentialsLocation).optional(),
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
        [types_1.AuthenticationType.AWSAccessKey]: zodCompleteStrictObject({
            type: zodDiscriminant(types_1.AuthenticationType.AWSAccessKey),
            service: z.string(),
            ...baseAuthenticationValidators,
        }),
        [types_1.AuthenticationType.AWSAssumeRole]: zodCompleteStrictObject({
            type: zodDiscriminant(types_1.AuthenticationType.AWSAssumeRole),
            service: z.string(),
            ...baseAuthenticationValidators,
        }),
        [types_1.AuthenticationType.Custom]: zodCompleteStrictObject({
            type: zodDiscriminant(types_1.AuthenticationType.Custom),
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
        [types_1.AuthenticationType.Various]: zodCompleteStrictObject({
            type: zodDiscriminant(types_1.AuthenticationType.Various),
        }),
    };
    const systemAuthenticationTypes = {
        [types_1.AuthenticationType.HeaderBearerToken]: true,
        [types_1.AuthenticationType.CustomHeaderToken]: true,
        [types_1.AuthenticationType.MultiHeaderToken]: true,
        [types_1.AuthenticationType.MultiQueryParamToken]: true,
        [types_1.AuthenticationType.QueryParamToken]: true,
        [types_1.AuthenticationType.WebBasic]: true,
        [types_1.AuthenticationType.AWSAccessKey]: true,
        [types_1.AuthenticationType.AWSAssumeRole]: true,
        [types_1.AuthenticationType.Custom]: true,
        [types_1.AuthenticationType.OAuth2ClientCredentials]: true,
    };
    const systemAuthenticationValidators = Object.entries(defaultAuthenticationValidators)
        .filter(([authType]) => authType in systemAuthenticationTypes)
        .map(([_authType, schema]) => schema);
    const variousSupportedAuthenticationTypes = {
        [types_1.AuthenticationType.HeaderBearerToken]: true,
        [types_1.AuthenticationType.CustomHeaderToken]: true,
        [types_1.AuthenticationType.MultiHeaderToken]: true,
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
        name: z
            .string()
            .max(exports.Limits.BuildingBlockName)
            .regex(regexParameterName, 'Parameter names can only contain alphanumeric characters and underscores.'),
        type: z
            .union([
            z.nativeEnum(api_types_4.Type),
            z.object({
                type: zodDiscriminant('array'),
                items: z.nativeEnum(api_types_4.Type),
                allowEmpty: z.boolean().optional(),
            }),
        ])
            .refine(paramType => paramType !== api_types_4.Type.object &&
            !(typeof paramType === 'object' && paramType.type === 'array' && paramType.items === api_types_4.Type.object), {
            message: 'Object parameters are not currently supported.',
        }),
        description: z.string().max(exports.Limits.BuildingBlockDescription),
        optional: z.boolean().optional(),
        autocomplete: z.unknown().optional(),
        defaultValue: z.unknown().optional(),
        suggestedValue: z.unknown().optional(),
    });
    const commonPackFormulaSchema = {
        // It would be preferable to use validateFormulaName here, but we have to exempt legacy packs with sync tables
        // whose getter names violate the validator, and those exemptions require the pack id, so this has to be
        // done as a superRefine on the top-level object that also contains the pack id.
        name: z.string().max(exports.Limits.BuildingBlockName),
        description: z.string().max(exports.Limits.BuildingBlockDescription),
        examples: z
            .array(z.object({
            params: z.array(z.union([
                primitiveUnion,
                z.array(primitiveUnion),
                z.undefined(),
                // Our TS only accepts undefined for optional params, but when an upload gets JSONified
                // and there is an undefined value in array, it gets serialized to null so we have
                // to accept it here.
                z.null(),
            ])),
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
        }, { message: 'All optional parameters must come after all non-optional parameters.' }),
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
    const booleanPackFormulaSchema = zodCompleteObject({
        ...commonPackFormulaSchema,
        resultType: zodDiscriminant(api_types_4.Type.boolean),
        schema: zodCompleteObject({
            type: zodDiscriminant(schema_13.ValueType.Boolean),
            codaType: z.enum([...schema_2.BooleanHintValueTypes]).optional(),
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
    function zodOptionsFieldWithValues(valueType, allowDisplayNames) {
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
        mutable: z.boolean().optional(),
        fixedId: z.string().optional(),
        fromKey: z.string().optional(),
        originalKey: z.string().optional(),
        required: z.boolean().optional(),
    };
    const baseStringPropertyValidators = {
        ...basePropertyValidators,
        autocomplete: sdkVersion && semver_1.default.satisfies(sdkVersion, '<=1.4.0')
            ? zodOptionsFieldWithValues(z.string(), true)
            : z.never().optional(),
    };
    const baseNumericPropertyValidators = {
        ...basePropertyValidators,
    };
    const booleanPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.Boolean),
        codaType: z.enum([...schema_2.BooleanHintValueTypes]).optional(),
        ...basePropertyValidators,
    });
    const numericPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.Number),
        codaType: zodDiscriminant(schema_12.ValueHintType.Percent).optional(),
        precision: z.number().optional(),
        useThousandsSeparator: z.boolean().optional(),
        ...baseNumericPropertyValidators,
    });
    const scalePropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.Number),
        codaType: zodDiscriminant(schema_12.ValueHintType.Scale),
        maximum: z.number().optional(),
        icon: z.nativeEnum(schema_10.ScaleIconSet).optional(),
        ...baseNumericPropertyValidators,
    });
    const optionalStringOrNumber = z.union([z.number(), z.string()]).optional();
    const sliderPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.Number),
        codaType: zodDiscriminant(schema_12.ValueHintType.Slider),
        maximum: optionalStringOrNumber,
        minimum: optionalStringOrNumber,
        step: optionalStringOrNumber,
        showValue: z.boolean().optional(),
        ...baseNumericPropertyValidators,
    });
    const progressBarPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.Number),
        codaType: zodDiscriminant(schema_12.ValueHintType.ProgressBar),
        maximum: optionalStringOrNumber,
        minimum: optionalStringOrNumber,
        step: optionalStringOrNumber,
        showValue: z.boolean().optional(),
        ...baseNumericPropertyValidators,
    });
    const currencyPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.Number),
        codaType: zodDiscriminant(schema_12.ValueHintType.Currency),
        precision: z.number().optional(),
        currencyCode: z.string().optional(),
        format: z.nativeEnum(schema_3.CurrencyFormat).optional(),
        ...baseNumericPropertyValidators,
    });
    const numericDatePropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.Number),
        codaType: zodDiscriminant(schema_12.ValueHintType.Date),
        format: z.string().optional(),
        ...baseNumericPropertyValidators,
    });
    const numericTimePropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.Number),
        codaType: zodDiscriminant(schema_12.ValueHintType.Time),
        format: z.string().optional(),
        ...baseNumericPropertyValidators,
    });
    const numericDateTimePropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.Number),
        codaType: zodDiscriminant(schema_12.ValueHintType.DateTime),
        dateFormat: z.string().optional(),
        timeFormat: z.string().optional(),
        ...baseNumericPropertyValidators,
    });
    const numericDurationPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.Number),
        codaType: zodDiscriminant(schema_12.ValueHintType.Duration),
        precision: z.number().optional(),
        maxUnit: z.nativeEnum(schema_4.DurationUnit).optional(),
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
    const numericPackFormulaSchema = zodCompleteObject({
        ...commonPackFormulaSchema,
        resultType: zodDiscriminant(api_types_4.Type.number),
        schema: numberPropertySchema.optional(),
    });
    const simpleStringPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.String),
        codaType: z.enum([...schema_11.SimpleStringHintValueTypes]).optional(),
        ...baseStringPropertyValidators,
    });
    const stringDatePropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.String),
        codaType: zodDiscriminant(schema_12.ValueHintType.Date),
        format: z.string().optional(),
        ...baseStringPropertyValidators,
    });
    const stringTimePropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.String),
        codaType: zodDiscriminant(schema_12.ValueHintType.Time),
        format: z.string().optional(),
        ...baseStringPropertyValidators,
    });
    const stringDateTimePropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.String),
        codaType: zodDiscriminant(schema_12.ValueHintType.DateTime),
        dateFormat: z.string().optional(),
        timeFormat: z.string().optional(),
        ...baseStringPropertyValidators,
    });
    const durationPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.String),
        codaType: zodDiscriminant(schema_12.ValueHintType.Duration),
        precision: z.number().optional(),
        maxUnit: z.nativeEnum(schema_4.DurationUnit).optional(),
        ...baseStringPropertyValidators,
    });
    const codaInternalRichTextSchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.String),
        codaType: zodDiscriminant(schema_12.ValueHintType.CodaInternalRichText),
        isCanvas: z.boolean().optional(),
        ...baseStringPropertyValidators,
    });
    const embedPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.String),
        codaType: zodDiscriminant(schema_12.ValueHintType.Embed),
        force: z.boolean().optional(),
        ...baseStringPropertyValidators,
    });
    const emailPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.String),
        codaType: zodDiscriminant(schema_12.ValueHintType.Email),
        display: z.nativeEnum(schema_5.EmailDisplayType).optional(),
        ...baseStringPropertyValidators,
    });
    const linkPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.String),
        codaType: zodDiscriminant(schema_12.ValueHintType.Url),
        display: z.nativeEnum(schema_8.LinkDisplayType).optional(),
        force: z.boolean().optional(),
        ...baseStringPropertyValidators,
    });
    const stringWithOptionsPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.String),
        codaType: zodDiscriminant(schema_12.ValueHintType.SelectList),
        ...baseStringPropertyValidators,
        options: zodOptionsFieldWithValues(z.string(), true),
        allowNewValues: z.boolean().optional(),
    });
    const imagePropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.String),
        codaType: z.union([zodDiscriminant(schema_12.ValueHintType.ImageAttachment), zodDiscriminant(schema_12.ValueHintType.ImageReference)]),
        imageOutline: z.nativeEnum(schema_7.ImageOutline).optional(),
        imageCornerStyle: z.nativeEnum(schema_6.ImageCornerStyle).optional(),
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
    const stringPackFormulaSchema = zodCompleteObject({
        ...commonPackFormulaSchema,
        resultType: zodDiscriminant(api_types_4.Type.string),
        schema: stringPropertySchema.optional(),
    });
    // TODO(jonathan): Give this a better type than ZodTypeAny after figuring out
    // recursive typing better.
    const arrayPropertySchema = z.lazy(() => zodCompleteStrictObject({
        type: zodDiscriminant(schema_13.ValueType.Array),
        items: objectPropertyUnionSchema,
        ...basePropertyValidators,
    }));
    const ValidCodaObjectIdRegex = /^[A-Za-z0-9_-]+$/;
    // This is ripped off from isValidObjectId in coda. Violating this causes a number of downstream headaches.
    function isValidObjectId(component) {
        return ValidCodaObjectIdRegex.test(component);
    }
    const SystemColumnNames = ['id', 'value', 'synced', 'connection'];
    let ExemptionType;
    (function (ExemptionType) {
        ExemptionType["IdentityName"] = "IdentityName";
        ExemptionType["SyncTableGetterName"] = "SyncTableGetterName";
    })(ExemptionType || (ExemptionType = {}));
    const Exemptions = [
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
    function exemptionKey(packId, entityName) {
        return `${packId}/${entityName}`;
    }
    const IdentityNameExemptions = new Set(Exemptions.filter(([_packId, _name, exemptionType]) => exemptionType === ExemptionType.IdentityName).map(([packId, name]) => exemptionKey(packId, name)));
    const SyncTableGetterNameExemptions = new Set(Exemptions.filter(([_packId, _name, exemptionType]) => exemptionType === ExemptionType.SyncTableGetterName).map(([packId, name]) => exemptionKey(packId, name)));
    function isValidIdentityName(packId, name) {
        if (packId && IdentityNameExemptions.has(exemptionKey(packId, name))) {
            return true;
        }
        if (packId === 1090) {
            // SalesForce pack has a large number of dynamic identity ids that include empty spaces.
            return true;
        }
        return isValidObjectId(name);
    }
    function isValidUseOfCodaInternalRichText(packId) {
        // CrossDoc pack is allowed to use this type hint.
        return packId === 1054;
    }
    const attributionSchema = z
        .array(z.union([textAttributionNodeSchema, linkAttributionNodeSchema, imageAttributionNodeSchema]))
        .optional();
    const propertySchema = z.union([
        z.string().min(1),
        zodCompleteObject({
            property: z.string().min(1),
            label: z.string().optional(),
            placeholder: z.string().optional(),
        }),
    ]);
    const genericObjectSchema = z.lazy(() => zodCompleteObject({
        ...basePropertyValidators,
        type: zodDiscriminant(schema_13.ValueType.Object),
        description: z.string().optional(),
        id: z.string().min(1).optional(),
        idProperty: z.string().min(1).optional(),
        primary: z.string().min(1).optional(),
        displayProperty: z.string().min(1).optional(),
        codaType: z.enum([...schema_9.ObjectHintValueTypes]).optional(),
        featured: z.array(z.string()).optional(),
        featuredProperties: z.array(z.string()).optional(),
        identity: zodCompleteObject({
            packId: z.number().optional(),
            name: z.string().nonempty(),
            dynamicUrl: z.string().optional(),
            attribution: attributionSchema,
        }).optional(),
        attribution: attributionSchema,
        properties: z.record(objectPropertyUnionSchema),
        includeUnknownProperties: z.boolean().optional(),
        __packId: z.number().optional(),
        titleProperty: propertySchema.optional(),
        linkProperty: propertySchema.optional(),
        subtitleProperties: z.array(propertySchema).optional(),
        snippetProperty: propertySchema.optional(),
        imageProperty: propertySchema.optional(),
        options: zodOptionsFieldWithValues(z.object({}).passthrough(), false),
        autocomplete: sdkVersion && semver_1.default.satisfies(sdkVersion, '<=1.4.0')
            ? zodOptionsFieldWithValues(z.string(), true)
            : z.never().optional(),
    })
        .superRefine((data, context) => {
        var _a, _b;
        if (!isValidIdentityName((_a = data.identity) === null || _a === void 0 ? void 0 : _a.packId, (_b = data.identity) === null || _b === void 0 ? void 0 : _b.name)) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['identity', 'name'],
                message: 'Invalid name. Identity names can only contain alphanumeric characters, underscores, and dashes, and no spaces.',
            });
        }
    })
        .superRefine((data, context) => {
        const schemaHelper = (0, migration_1.objectSchemaHelper)(data);
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
        .refine(data => {
        const schemaHelper = (0, migration_1.objectSchemaHelper)(data);
        return (0, object_utils_2.isNil)(schemaHelper.id) || schemaHelper.id in schemaHelper.properties;
    }, {
        message: 'The "idProperty" property must appear as a key in the "properties" object.',
    })
        .refine(data => {
        const schemaHelper = (0, migration_1.objectSchemaHelper)(data);
        return (0, object_utils_2.isNil)(schemaHelper.primary) || schemaHelper.primary in schemaHelper.properties;
    }, {
        message: 'The "displayProperty" property must appear as a key in the "properties" object.',
    })
        .superRefine((data, context) => {
        const schemaHelper = (0, migration_1.objectSchemaHelper)(data);
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
        const schema = data;
        /**
         * Validates a PropertyIdentifier key in the object schema.
         */
        function validateProperty(propertyKey, isValidSchema, invalidSchemaMessage) {
            function validatePropertyIdentifier(value, objectPath = [propertyKey]) {
                var _a;
                const propertyValue = typeof value === 'string' ? value : value === null || value === void 0 ? void 0 : value.property;
                let propertyValueIsPath = false;
                let propertySchema = typeof propertyValueRaw === 'string' && propertyValue in schema.properties
                    ? schema.properties[propertyValue]
                    : undefined;
                if (!propertySchema) {
                    const schemaPropertyPath = (0, schema_19.normalizePropertyValuePathIntoSchemaPath)(propertyValue);
                    propertySchema = (_a = (0, jsonpath_plus_1.JSONPath)({
                        path: schemaPropertyPath,
                        json: schema.properties,
                    })) === null || _a === void 0 ? void 0 : _a[0];
                    propertyValueIsPath = true;
                }
                const propertyIdentifierDisplay = propertyValueIsPath
                    ? `"${propertyKey}" path`
                    : `"${propertyKey}" field name`;
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
            const propertyValueRaw = schema[propertyKey];
            if (propertyValueRaw) {
                if (Array.isArray(propertyValueRaw)) {
                    propertyValueRaw.forEach((propertyIdentifier, i) => {
                        validatePropertyIdentifier(propertyIdentifier, [propertyKey, i]);
                    });
                    return;
                }
                validatePropertyIdentifier(propertyValueRaw);
            }
        }
        const validateTitleProperty = () => {
            return validateProperty('titleProperty', propertySchema => [schema_13.ValueType.String, schema_13.ValueType.Object].includes(propertySchema.type), `must refer to a "ValueType.String" or "ValueType.Object" property.`);
        };
        const validateImageProperty = () => {
            return validateProperty('imageProperty', imagePropertySchema => imagePropertySchema.type === schema_13.ValueType.String &&
                [schema_12.ValueHintType.ImageAttachment, schema_12.ValueHintType.ImageReference].includes(imagePropertySchema.codaType), `must refer to a "ValueType.String" property with a "ValueHintType.ImageAttachment" or "ValueHintType.ImageReference" "codaType".`);
        };
        const validateSnippetProperty = () => {
            return validateProperty('snippetProperty', snippetPropertySchema => snippetPropertySchema.type === schema_13.ValueType.String ||
                (snippetPropertySchema.type === schema_13.ValueType.Array && snippetPropertySchema.items.type === schema_13.ValueType.String), `must refer to a "ValueType.String" property or array of strings.`);
        };
        const validateLinkProperty = () => {
            return validateProperty('linkProperty', linkPropertySchema => linkPropertySchema.type === schema_13.ValueType.String && linkPropertySchema.codaType === schema_12.ValueHintType.Url, `must refer to a "ValueType.String" property with a "ValueHintType.Url" "codaType".`);
        };
        const validateSubtitleProperties = () => {
            return validateProperty('subtitleProperties', subtitlePropertySchema => {
                if (!('codaType' in subtitlePropertySchema && subtitlePropertySchema.codaType)) {
                    return true;
                }
                switch (subtitlePropertySchema.codaType) {
                    case schema_12.ValueHintType.ImageAttachment:
                    case schema_12.ValueHintType.Attachment:
                    case schema_12.ValueHintType.ImageReference:
                    case schema_12.ValueHintType.Embed:
                    case schema_12.ValueHintType.Scale:
                        return false;
                    case schema_12.ValueHintType.CodaInternalRichText:
                    case schema_12.ValueHintType.Currency:
                    case schema_12.ValueHintType.Date:
                    case schema_12.ValueHintType.DateTime:
                    case schema_12.ValueHintType.Duration:
                    case schema_12.ValueHintType.Email:
                    case schema_12.ValueHintType.Html:
                    case schema_12.ValueHintType.Markdown:
                    case schema_12.ValueHintType.Percent:
                    case schema_12.ValueHintType.Person:
                    case schema_12.ValueHintType.ProgressBar:
                    case schema_12.ValueHintType.Reference:
                    case schema_12.ValueHintType.SelectList:
                    case schema_12.ValueHintType.Slider:
                    case schema_12.ValueHintType.Toggle:
                    case schema_12.ValueHintType.Time:
                    case schema_12.ValueHintType.Url:
                        return true;
                    default:
                        (0, ensure_2.ensureUnreachable)(subtitlePropertySchema.codaType);
                }
            }, `must refer to a value that does not have a codaType corresponding to one of ImageAttachment, Attachment, ImageReference, Embed, or Scale.`);
        };
        validateTitleProperty();
        validateLinkProperty();
        validateImageProperty();
        validateSnippetProperty();
        validateSubtitleProperties();
    })
        .superRefine((data, context) => {
        var _a;
        const schemaHelper = (0, migration_1.objectSchemaHelper)(data);
        const internalRichTextPropertyTuple = Object.entries(schemaHelper.properties).find(([_key, prop]) => prop.type === schema_13.ValueType.String && prop.codaType === schema_12.ValueHintType.CodaInternalRichText);
        if (internalRichTextPropertyTuple && !isValidUseOfCodaInternalRichText((_a = data.identity) === null || _a === void 0 ? void 0 : _a.packId)) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['identity', 'properties', internalRichTextPropertyTuple[0]],
                message: 'Invalid codaType. CodaInternalRichText is not a supported value.',
            });
            return;
        }
    }));
    const objectPropertyUnionSchema = z
        .union([
        booleanPropertySchema,
        numberPropertySchema,
        stringPropertySchema,
        arrayPropertySchema,
        genericObjectSchema,
    ])
        .refine((schema) => {
        if (sdkVersion && semver_1.default.satisfies(sdkVersion, '<=1.4.0')) {
            // ValueHintType.SelectList is only required for autocomplete starting in version 1.4.1
            return true;
        }
        const schemaForOptions = (0, schema_18.maybeUnwrapArraySchema)(schema);
        const result = !schemaForOptions ||
            (0, schema_20.unwrappedSchemaSupportsOptions)(schemaForOptions) ||
            !('options' in schemaForOptions && schemaForOptions.options);
        return result;
    }, 'You must set "codaType" to ValueHintType.SelectList or ValueHintType.Reference when setting an "options" property.');
    const objectPackFormulaSchema = zodCompleteObject({
        ...commonPackFormulaSchema,
        resultType: zodDiscriminant(api_types_4.Type.object),
        // TODO(jonathan): See if we should really allow this. The SDK right now explicitly tolerates an undefined
        // schema for objects, but that doesn't seem like a use case we actually want to support.
        schema: z.union([genericObjectSchema, arrayPropertySchema]).optional(),
    });
    const formulaMetadataSchema = z
        .union([numericPackFormulaSchema, stringPackFormulaSchema, booleanPackFormulaSchema, objectPackFormulaSchema])
        .superRefine((data, context) => {
        const parameters = data.parameters;
        const varargParameters = data.varargParameters || [];
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
    });
    const formatMetadataSchema = zodCompleteObject({
        name: z.string().max(exports.Limits.BuildingBlockName),
        formulaNamespace: z.string().optional(),
        formulaName: z.string(),
        hasNoConnection: z.boolean().optional(),
        instructions: z.string().optional(),
        placeholder: z.string().optional(),
        matchers: z
            .array(z.string().max(exports.Limits.ColumnMatcherRegex).refine(validateFormatMatcher))
            .max(exports.Limits.NumColumnMatchersPerFormat),
    });
    const syncFormulaSchema = zodCompleteObject({
        schema: arrayPropertySchema.optional(),
        resultType: z.any(),
        isSyncFormula: z.literal(true),
        maxUpdateBatchSize: z.number().min(1).max(exports.Limits.UpdateBatchSize).optional(),
        supportsUpdates: z.boolean().optional(),
        ...commonPackFormulaSchema,
        updateOptions: z.strictObject({ extraOAuthScopes: commonPackFormulaSchema.extraOAuthScopes }).optional(),
    });
    const baseSyncTableSchema = {
        name: z
            .string()
            .nonempty()
            .max(exports.Limits.BuildingBlockName)
            .regex(regexFormulaName, 'Sync Table names can only contain alphanumeric characters and underscores.'),
        description: z.string().max(exports.Limits.BuildingBlockDescription).optional(),
        schema: genericObjectSchema,
        getter: syncFormulaSchema,
        entityName: z.string().optional(),
        defaultAddDynamicColumns: z.boolean().optional(),
        // TODO(patrick): Make identityName non-optional after SDK v1.0.0 is required
        identityName: z
            .string()
            .min(1)
            .max(exports.Limits.BuildingBlockName)
            .optional()
            .refine(val => !val || !SystemColumnNames.includes(val), `This property name is reserved for internal use by Coda and can't be used as an identityName, sorry!`),
        // namedAutocompletes no longer does anything, but old SDK version may try to set it.
        namedAutocompletes: sdkVersion && semver_1.default.satisfies(sdkVersion, '<=1.4.0') ? z.any().optional() : z.never().optional(),
        namedPropertyOptions: z
            .record(formulaMetadataSchema)
            .optional()
            .default({})
            .superRefine((data, context) => {
            if (Object.keys(data).length > exports.Limits.BuildingBlockName) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Too many options formulas for sync table. Max allowed is "${exports.Limits.BuildingBlockName}".`,
                });
            }
        }),
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
        searchDynamicUrls: formulaMetadataSchema.optional(),
        getSchema: formulaMetadataSchema,
        autocomplete: sdkVersion && semver_1.default.satisfies(sdkVersion, '<=1.4.0') ? objectPackFormulaSchema.optional() : z.never().optional(),
        propertyOptions: objectPackFormulaSchema.optional(),
    }).strict();
    const syncTableSchema = z
        .union([genericDynamicSyncTableSchema, genericSyncTableSchema])
        .superRefine((data, context) => {
        const syncTable = data;
        if (syncTable.getter.varargParameters && syncTable.getter.varargParameters.length > 0) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['getter', 'varargParameters'],
                message: 'Sync table formulas do not currently support varargParameters.',
            });
        }
    });
    // Make sure to call the refiners on this after removing legacyPackMetadataSchema.
    // (Zod doesn't let you call .extends() after you've called .refine(), so we're only refining the top-level
    // schema we actually use.)
    const unrefinedPackVersionMetadataSchema = zodCompleteObject({
        version: z
            .string()
            .regex(/^\d+(\.\d+){0,2}$/, 'Pack versions must use semantic versioning, e.g. "1", "1.0" or "1.0.0".')
            .refine(
        // Version numbers must not be bigger than a postgres integer.
        version => version.split('.').filter(part => Number(part) > 2147483647).length === 0, 'Pack version number too large'),
        defaultAuthentication: z.union(zodUnionInput(Object.values(defaultAuthenticationValidators))).optional(),
        networkDomains: z
            .array(z
            .string()
            .max(exports.Limits.NetworkDomainUrl)
            .refine(domain => !(domain.startsWith('http:') || domain.startsWith('https:') || domain.indexOf('/') >= 0), {
            message: 'Invalid network domain. Instead of "https://www.example.com", just specify "example.com".',
        }))
            .optional(),
        formulaNamespace: z.string().optional().refine(validateNamespace, {
            message: 'Formula namespaces can only contain alphanumeric characters and underscores.',
        }),
        systemConnectionAuthentication: z.union(zodUnionInput(systemAuthenticationValidators)).optional(),
        formulas: z
            .array(formulaMetadataSchema)
            .max(exports.Limits.BuildingBlockCountPerType)
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
            .max(exports.Limits.BuildingBlockCountPerType)
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
            .max(exports.Limits.BuildingBlockCountPerType)
            .optional()
            .default([])
            .superRefine((data, context) => {
            var _a, _b;
            const identityNames = [];
            for (const tableDef of data) {
                if (tableDef.identityName && ((_a = tableDef.schema.identity) === null || _a === void 0 ? void 0 : _a.name)) {
                    if (tableDef.identityName !== tableDef.schema.identity.name) {
                        context.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: `Sync table "${tableDef.name}" defines identityName "${tableDef.identityName}" that conflicts with its schema's identity.name "${tableDef.schema.identity.name}".`,
                        });
                    }
                }
                // only add identity names that are not undefined to check for dupes
                if (tableDef.schema.identity) {
                    identityNames.push((_b = tableDef.schema.identity) === null || _b === void 0 ? void 0 : _b.name);
                }
            }
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
            .refine(untypedMetadata => {
            var _a, _b;
            const metadata = untypedMetadata;
            if (((_a = metadata.defaultAuthentication) === null || _a === void 0 ? void 0 : _a.type) !== types_1.AuthenticationType.CodaApiHeaderBearerToken) {
                return true;
            }
            const codaDomains = ['coda.io', 'localhost'];
            const hasNonCodaNetwork = (_b = metadata.networkDomains) === null || _b === void 0 ? void 0 : _b.some((domain) => !codaDomains.includes(domain));
            if (!hasNonCodaNetwork) {
                return true;
            }
            const authDomains = getAuthNetworkDomains(metadata);
            if (!(authDomains === null || authDomains === void 0 ? void 0 : authDomains.length)) {
                // A non-Coda network domain without auth domain restriction isn't allowed.
                return false;
            }
            const hasNonCodaAuthDomain = authDomains.some((domain) => !codaDomains.includes(domain));
            // A non-coda auth domain is always an issue.
            return !hasNonCodaAuthDomain;
        }, {
            message: 'CodaApiHeaderBearerToken can only be used for coda.io domains. Restrict `defaultAuthentication.networkDomain` to coda.io',
            path: ['defaultAuthentication.networkDomain'],
        })
            .superRefine((data, context) => {
            if (data.defaultAuthentication && data.defaultAuthentication.type !== types_1.AuthenticationType.None) {
                return;
            }
            // if the pack has no default authentication, make sure all formulas don't set connection requirements.
            (data.formulas || []).forEach((formula, i) => {
                if (formula.connectionRequirement && formula.connectionRequirement !== api_types_1.ConnectionRequirement.None) {
                    context.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['formulas', i],
                        message: 'Formulas cannot set a connectionRequirement when the Pack does not use user authentication.',
                    });
                }
            });
            (data.syncTables || []).forEach((syncTable, i) => {
                const connectionRequirement = syncTable.getter.connectionRequirement;
                if (connectionRequirement && connectionRequirement !== api_types_1.ConnectionRequirement.None) {
                    context.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['syncTables', i, 'getter', 'connectionRequirement'],
                        message: 'Sync table formulas cannot set a connectionRequirement when the Pack does not use user authentication.',
                    });
                }
            });
        })
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
    function validateFormatMatcher(value) {
        try {
            const parsed = value.match(exports.PACKS_VALID_COLUMN_FORMAT_MATCHER_REGEX);
            if (!parsed) {
                return false;
            }
            const [, pattern, flags] = parsed;
            new RegExp(pattern, flags);
            return true;
        }
        catch (error) {
            return false;
        }
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
        category: z.nativeEnum(types_3.PackCategory).optional(),
        logoPath: z.string().optional(),
        exampleImages: z.array(z.string()).optional(),
        exampleVideoIds: z.array(z.string()).optional(),
        minimumFeatureSet: z.nativeEnum(types_2.FeatureSet).optional(),
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
        .superRefine((data, context) => {
        (data.syncTables || []).forEach((syncTable, i) => {
            const packId = data.id;
            const getterName = syncTable.getter.name;
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
        (data.formulas || []).forEach((formula, i) => {
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
        .refine(data => {
        var _a, _b, _c;
        const usesAuthentication = (data.defaultAuthentication && data.defaultAuthentication.type !== types_1.AuthenticationType.None) ||
            data.systemConnectionAuthentication;
        if (!usesAuthentication || ((_a = data.networkDomains) === null || _a === void 0 ? void 0 : _a.length) || ((_b = data.defaultAuthentication) === null || _b === void 0 ? void 0 : _b.requiresEndpointUrl)) {
            return true;
        }
        // Various is an internal authentication type that's only applicable to whitelisted Pack Ids.
        // Skipping validation here to let it exempt from network domains.
        if (((_c = data.defaultAuthentication) === null || _c === void 0 ? void 0 : _c.type) === types_1.AuthenticationType.Various) {
            return true;
        }
        return false;
    }, {
        message: 'This pack uses authentication but did not declare a network domain. ' +
            "Specify the domain that your pack makes http requests to using `networkDomains: ['example.com']`",
        path: ['networkDomains'],
    })
        .superRefine((untypedData, context) => {
        var _a;
        const data = untypedData;
        const authNetworkDomains = getAuthNetworkDomains(data);
        if (!(0, object_utils_1.isDefined)(authNetworkDomains)) {
            // This is a Various or None auth pack.
            return;
        }
        // Auth network domains must match pack network domains.
        for (const authNetworkDomain of authNetworkDomains) {
            if (!((_a = data.networkDomains) === null || _a === void 0 ? void 0 : _a.includes(authNetworkDomain))) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['defaultAuthentication.networkDomain'],
                    message: 'The `networkDomain` in setUserAuthentication() must match a previously declared network domain.',
                });
                return;
            }
        }
    })
        .superRefine((untypedData, context) => {
        const data = untypedData;
        const authNetworkDomains = getAuthNetworkDomains(data);
        if (!(0, object_utils_1.isDefined)(authNetworkDomains)) {
            // This is a Various or None auth pack.
            return;
        }
        // A pack with multiple networks and auth must choose which domain(s) get auth on them.
        if (!(authNetworkDomains === null || authNetworkDomains === void 0 ? void 0 : authNetworkDomains.length)) {
            if (data.networkDomains && data.networkDomains.length > 1) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['defaultAuthentication.networkDomain'],
                    message: 'This pack uses multiple network domains and must set one as a `networkDomain` in setUserAuthentication()',
                });
            }
            return;
        }
    })
        .superRefine((untypedData, context) => {
        const data = untypedData;
        (data.syncTables || []).forEach((syncTable, i) => {
            const schema = syncTable.schema;
            for (const [propertyName, childSchema] of Object.entries(schema.properties)) {
                const options = (0, schema_17.maybeSchemaOptionsValue)(childSchema);
                if (!options || Array.isArray(options)) {
                    continue;
                }
                if (typeof options !== 'string' || !(options in (syncTable.namedPropertyOptions || {}))) {
                    context.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['syncTables', i, 'properties', propertyName, 'options'],
                        message: options === api_types_3.OptionsType.Dynamic
                            ? `Sync table ${syncTable.name} must define "options" for this property to use OptionsType.Dynamic`
                            : `"${options}" is not registered as an options function for this sync table.`,
                    });
                    continue;
                }
            }
        });
    });
    return { legacyPackMetadataSchema, variousSupportedAuthenticationValidators, arrayPropertySchema };
}
// Returns undefined for None or Various auth, otherwise returns a string array.
function getAuthNetworkDomains(data) {
    if (!data.defaultAuthentication ||
        data.defaultAuthentication.type === types_1.AuthenticationType.Various ||
        data.defaultAuthentication.type === types_1.AuthenticationType.None) {
        return undefined;
    }
    if (data.defaultAuthentication.requiresEndpointUrl) {
        // We're ok if there's a user-supplied endpoint domain.
        return undefined;
    }
    if (Array.isArray(data.defaultAuthentication.networkDomain)) {
        return data.defaultAuthentication.networkDomain;
    }
    else if (data.defaultAuthentication.networkDomain) {
        return [data.defaultAuthentication.networkDomain];
    }
    return [];
}
// TODO(dweitzman): Migrate SchemaExtensions to use conditionals in buildMetadataSchema() and delete
// the SchemaExtension feature.
const packMetadataSchemaBySdkVersion = [
    {
        versionRange: '>=1.0.0',
        schemaExtend: schema => {
            return schema.superRefine((untypedData, context) => {
                const data = untypedData;
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
                        let receivedType = zod_1.ZodParsedType.unknown;
                        if (syncTable.identityName === undefined) {
                            receivedType = zod_1.ZodParsedType.undefined;
                        }
                        else if (syncTable.identityName === null) {
                            receivedType = zod_1.ZodParsedType.null;
                        }
                        context.addIssue({
                            code: z.ZodIssueCode.invalid_type,
                            path: ['syncTables', i, 'identityName'],
                            message: 'An identityName is required on all sync tables',
                            expected: zod_1.ZodParsedType.string,
                            received: receivedType,
                        });
                    }
                });
                const { defaultAuthentication: auth } = data;
                if (auth && auth.type !== types_1.AuthenticationType.None && auth.postSetup) {
                    auth.postSetup.forEach((step, i) => {
                        validateDeprecatedProperty({
                            obj: step,
                            oldName: 'getOptionsFormula',
                            newName: 'getOptions',
                            pathPrefix: ['defaultAuthentication', 'postSetup', i],
                            context,
                        });
                    });
                }
            });
        },
    },
];
function validateSchemaDeprecatedFields(schema, pathPrefix, context) {
    if ((0, schema_15.isObject)(schema)) {
        validateObjectSchemaDeprecatedFields(schema, pathPrefix, context);
    }
    if ((0, schema_14.isArray)(schema)) {
        validateSchemaDeprecatedFields(schema.items, [...pathPrefix, 'items'], context);
    }
}
function validateObjectSchemaDeprecatedFields(schema, pathPrefix, context) {
    var _a;
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
    if ((_a = schema.identity) === null || _a === void 0 ? void 0 : _a.attribution) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            path: [...pathPrefix, 'identity', 'attribution'],
            message: 'Attribution has moved and is no longer nested in the Identity object. ' +
                'Instead of specifying `schema.identity.attribution`, simply specify `schema.attribution`.',
        });
    }
    for (const [propertyName, childSchema] of Object.entries(schema.properties)) {
        validateSchemaDeprecatedFields(childSchema, [...pathPrefix, 'properties', propertyName], context);
    }
}
function validateDeprecatedProperty({ obj, oldName, newName, pathPrefix, context, }) {
    if (obj[oldName] !== undefined) {
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
function validateDeprecatedParameterFields(param, pathPrefix, context) {
    validateDeprecatedProperty({
        obj: param,
        oldName: 'defaultValue',
        newName: 'suggestedValue',
        pathPrefix,
        context,
    });
}
