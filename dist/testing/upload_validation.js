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
exports.zodErrorDetailToValidationError = exports._hasCycle = exports.validateParents = exports.validateCrawlHierarchy = exports.validateSyncTableSchema = exports.validateVariousAuthenticationMetadata = exports.validatePackVersionMetadata = exports.PackMetadataValidationError = exports.Limits = exports.PACKS_VALID_COLUMN_FORMAT_MATCHER_REGEX = void 0;
const api_types_1 = require("../api_types");
const schema_1 = require("../schema");
const types_1 = require("../types");
const schema_2 = require("../schema");
const api_types_2 = require("../api_types");
const schema_3 = require("../schema");
const schema_4 = require("../schema");
const schema_5 = require("../schema");
const schema_6 = require("../schema");
const types_2 = require("../types");
const schema_7 = require("../schema");
const schema_8 = require("../schema");
const schema_9 = require("../schema");
const schema_10 = require("../schema");
const jsonpath_plus_1 = require("jsonpath-plus");
const types_3 = require("../types");
const schema_11 = require("../schema");
const schema_12 = require("../schema");
const api_types_3 = require("../api_types");
const schema_13 = require("../schema");
const api_types_4 = require("../api_types");
const types_4 = require("../types");
const schema_14 = require("../schema");
const types_5 = require("../types");
const __1 = require("..");
const types_6 = require("../types");
const schema_15 = require("../schema");
const types_7 = require("../types");
const schema_16 = require("../schema");
const api_types_5 = require("../api_types");
const types_8 = require("../types");
const types_9 = require("../types");
const api_types_6 = require("../api_types");
const url_parse_1 = __importDefault(require("url-parse"));
const schema_17 = require("../schema");
const schema_18 = require("../schema");
const zod_1 = require("zod");
const ensure_1 = require("../helpers/ensure");
const ensure_2 = require("../helpers/ensure");
const schema_19 = require("../schema");
const api_types_7 = require("../api_types");
const schema_20 = require("../schema");
const object_utils_1 = require("../helpers/object_utils");
const object_utils_2 = require("../helpers/object_utils");
const schema_21 = require("../schema");
const api_1 = require("../api");
const schema_22 = require("../schema");
const schema_23 = require("../schema");
const schema_24 = require("../schema");
const schema_25 = require("../schema");
const migration_1 = require("../helpers/migration");
const semver_1 = __importDefault(require("semver"));
const schema_26 = require("../schema");
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
    MaxSkillCount: 15,
    NumColumnMatchersPerFormat: 10,
    NetworkDomainUrl: 253,
    PermissionsBatchSize: 5000,
    PromptLength: 10000,
    UpdateBatchSize: 1000,
    FilterableProperties: 5,
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
    const syntheticArraySchema = (0, schema_22.makeSchema)({
        type: schema_18.ValueType.Array,
        items: schema,
    });
    const validatedAsObjectSchema = arrayPropertySchema.safeParse(syntheticArraySchema);
    if (validatedAsObjectSchema.success) {
        return validatedAsObjectSchema.data;
    }
    throw new PackMetadataValidationError('Schema failed validation', validated.error, validated.error.errors.flatMap(zodErrorDetailToValidationError));
}
exports.validateSyncTableSchema = validateSyncTableSchema;
function makePropertyValidator(schema, context) {
    /**
     * Validates a PropertyIdentifier key in the object schema.
     */
    return function validateProperty(propertyValueRaw, fieldName, isValidSchema, invalidSchemaMessage, propertyObjectPath = [fieldName]) {
        function validatePropertyIdentifier(value, objectPath) {
            var _a;
            const propertyValue = typeof value === 'string' ? value : value === null || value === void 0 ? void 0 : value.property;
            let propertyValueIsPath = false;
            let propertySchema = typeof propertyValueRaw === 'string' && propertyValue in schema.properties
                ? schema.properties[propertyValue]
                : undefined;
            if (!propertySchema) {
                const schemaPropertyPath = (0, schema_25.normalizePropertyValuePathIntoSchemaPath)(propertyValue);
                propertySchema = (_a = (0, jsonpath_plus_1.JSONPath)({
                    path: schemaPropertyPath,
                    json: schema.properties,
                    eval: false,
                })) === null || _a === void 0 ? void 0 : _a[0];
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
function validateCrawlHierarchy(syncTables, context) {
    const parentToChildrenMap = {};
    const syncTableSchemasByName = {};
    for (const syncTable of syncTables) {
        syncTableSchemasByName[syncTable.name] = syncTable.schema;
    }
    for (const [tableIndex, syncTable] of syncTables.entries()) {
        let firstDiscoveredParentTable;
        for (const [paramIndex, param] of syncTable.getter.parameters.entries()) {
            if (!param.crawlStrategy) {
                continue;
            }
            if (param.crawlStrategy.parentTable) {
                const { tableName: parentTableName, propertyKey, inheritPermissions } = param.crawlStrategy.parentTable;
                const tableSchema = syncTableSchemasByName[parentTableName];
                if (!tableSchema) {
                    context === null || context === void 0 ? void 0 : context.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['syncTables', tableIndex, 'parameters', paramIndex, 'crawlStrategy', 'parentTable'],
                        message: `Sync table ${syncTable.name} expects parent table ${parentTableName} to exist.`,
                    });
                    return undefined;
                }
                const property = tableSchema.properties[propertyKey];
                if (!property) {
                    context === null || context === void 0 ? void 0 : context.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['syncTables', tableIndex, 'parameters', paramIndex, 'crawlStrategy', 'parentTable'],
                        message: `Sync table ${syncTable.name} expects parent table ${parentTableName}'s schema to have the property ${propertyKey}.`,
                    });
                    return undefined;
                }
                if (inheritPermissions && !(tableSchema.id === propertyKey || tableSchema.idProperty === propertyKey)) {
                    context === null || context === void 0 ? void 0 : context.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['syncTables', tableIndex, 'parameters', paramIndex, 'crawlStrategy', 'parentTable'],
                        message: `Sync table ${syncTable.name} expects parent table ${parentTableName}'s schema to have inheritPermissions on the id property.`,
                    });
                    return undefined;
                }
                // TODO(patrick): Validate the types match
                // We only allow one parent per table.
                if (firstDiscoveredParentTable && firstDiscoveredParentTable !== parentTableName) {
                    context === null || context === void 0 ? void 0 : context.addIssue({
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
        context === null || context === void 0 ? void 0 : context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['syncTables'],
            message: `Sync table parent hierarchy is cyclic`,
        });
        return undefined;
    }
    return parentToChildrenMap;
}
exports.validateCrawlHierarchy = validateCrawlHierarchy;
function validateParents(syncTables, context) {
    const syncTableSchemasByName = {};
    for (const syncTable of syncTables) {
        syncTableSchemasByName[syncTable.identityName] = syncTable.schema;
    }
    for (const [tableIndex, syncTable] of syncTables.entries()) {
        const parentDefinition = syncTable.schema.parent;
        if (!parentDefinition) {
            continue;
        }
        const propertyValidator = makePropertyValidator(syncTable.schema, context);
        propertyValidator(parentDefinition.parentIdProperty, 'parentIdProperty', parentIdPropertySchema => {
            var _a;
            return Boolean(parentIdPropertySchema.type === schema_18.ValueType.Object &&
                parentIdPropertySchema.codaType === schema_17.ValueHintType.Reference &&
                ((_a = parentIdPropertySchema.identity) === null || _a === void 0 ? void 0 : _a.name) &&
                syncTableSchemasByName[parentIdPropertySchema.identity.name]);
        }, `must reference a property with a valid identity in the pack.`, ['syncTables', tableIndex, 'schema', 'parent', 'parentIdProperty']);
    }
}
exports.validateParents = validateParents;
// Exported for tests
/** @hidden */
function _hasCycle(tree) {
    function subtreeHasCycle(currentKey, children, visited) {
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
    return subtreeHasCycle('__CODA_INTERNAL_ROOT__', Object.keys(tree), new Set());
}
exports._hasCycle = _hasCycle;
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
    type: zodDiscriminant(types_5.PostSetupType.SetEndpoint),
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
            credentialsLocation: z.nativeEnum(types_8.TokenExchangeCredentialsLocation).optional(),
            ...baseAuthenticationValidators,
        }).superRefine(({ requiresEndpointUrl, endpointKey, authorizationUrl, tokenUrl }, context) => {
            const expectsRelativeUrl = requiresEndpointUrl && !endpointKey;
            const isRelativeUrl = (url) => url.startsWith('/');
            const addIssue = (property) => {
                const expectedType = expectsRelativeUrl ? 'a relative' : 'an absolute';
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [property],
                    message: `${property} must be ${expectedType} URL when \
${endpointKey ? 'endpointKey is set' : `requiresEndpointUrl is ${requiresEndpointUrl !== null && requiresEndpointUrl !== void 0 ? requiresEndpointUrl : 'not true'}`}`,
                });
            };
            if ((expectsRelativeUrl && !isRelativeUrl(authorizationUrl)) ||
                (!expectsRelativeUrl && !isAbsoluteUrl(authorizationUrl))) {
                addIssue('authorizationUrl');
            }
            if ((expectsRelativeUrl && !isRelativeUrl(tokenUrl)) || (!expectsRelativeUrl && !isAbsoluteUrl(tokenUrl))) {
                addIssue('tokenUrl');
            }
        }),
        [types_1.AuthenticationType.OAuth2ClientCredentials]: zodCompleteStrictObject({
            type: zodDiscriminant(types_1.AuthenticationType.OAuth2ClientCredentials),
            tokenUrl: z.string().url().refine(validateUrlParsesIfAbsolute),
            scopes: z.array(z.string()).optional(),
            scopeDelimiter: z.enum([' ', ',', ';']).optional(),
            tokenPrefix: z.string().optional(),
            tokenQueryParam: z.string().optional(),
            scopeParamName: z.string().optional(),
            nestedResponseKey: z.string().optional(),
            credentialsLocation: z.nativeEnum(types_8.TokenExchangeCredentialsLocation).optional(),
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
        [types_1.AuthenticationType.GoogleDomainWideDelegation]: zodCompleteStrictObject({
            type: zodDiscriminant(types_1.AuthenticationType.GoogleDomainWideDelegation),
            scopes: z.array(z.string()).nonempty(),
            ...baseAuthenticationValidators,
        }),
        [types_1.AuthenticationType.GoogleServiceAccount]: zodCompleteStrictObject({
            type: zodDiscriminant(types_1.AuthenticationType.GoogleServiceAccount),
            scopes: z.array(z.string()).nonempty(),
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
        [types_1.AuthenticationType.GoogleServiceAccount]: true,
    };
    const systemAuthenticationValidators = Object.entries(defaultAuthenticationValidators)
        .filter(([authType]) => authType in systemAuthenticationTypes)
        .map(([_authType, schema]) => schema);
    const adminAuthenticationTypes = {
        [types_1.AuthenticationType.AWSAccessKey]: true,
        [types_1.AuthenticationType.AWSAssumeRole]: true,
        [types_1.AuthenticationType.CodaApiHeaderBearerToken]: true,
        [types_1.AuthenticationType.Custom]: true,
        [types_1.AuthenticationType.CustomHeaderToken]: true,
        [types_1.AuthenticationType.GoogleServiceAccount]: true,
        [types_1.AuthenticationType.GoogleDomainWideDelegation]: true,
        [types_1.AuthenticationType.HeaderBearerToken]: true,
        [types_1.AuthenticationType.MultiHeaderToken]: true,
        [types_1.AuthenticationType.MultiQueryParamToken]: true,
        [types_1.AuthenticationType.OAuth2]: true,
        [types_1.AuthenticationType.OAuth2ClientCredentials]: true,
        [types_1.AuthenticationType.QueryParamToken]: true,
        [types_1.AuthenticationType.WebBasic]: true,
    };
    const adminAuthenticationValidators = Object.entries(defaultAuthenticationValidators)
        .filter(([authType]) => authType in adminAuthenticationTypes)
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
    const reservedAuthenticationNames = Object.values(types_6.ReservedAuthenticationNames).map(value => value.toString());
    const adminAuthenticationValidator = zodCompleteObject({
        authentication: z.union(zodUnionInput(Object.values(adminAuthenticationValidators))),
        name: z
            .string()
            .min(1)
            .max(exports.Limits.BuildingBlockName)
            .regex(regexParameterName, 'Authentication names can only contain alphanumeric characters and underscores.')
            .refine(name => !reservedAuthenticationNames.includes(name), {
            message: 'Authentication names must not be one of the reserved authentication names.',
        }),
        displayName: z.string().min(1).max(exports.Limits.BuildingBlockName),
        description: z.string().min(1).max(exports.Limits.BuildingBlockDescription),
    });
    const primitiveUnion = z.union([z.number(), z.string(), z.boolean(), z.date()]);
    const paramDefValidator = zodCompleteObject({
        name: z
            .string()
            .max(exports.Limits.BuildingBlockName)
            .regex(regexParameterName, 'Parameter names can only contain alphanumeric characters and underscores.'),
        type: z
            .union([
            z.nativeEnum(api_types_6.Type),
            z.object({
                type: zodDiscriminant('array'),
                items: z.nativeEnum(api_types_6.Type),
                allowEmpty: z.boolean().optional(),
            }),
        ])
            .refine(paramType => paramType !== api_types_6.Type.object &&
            !(typeof paramType === 'object' && paramType.type === 'array' && paramType.items === api_types_6.Type.object), {
            message: 'Object parameters are not currently supported.',
        }),
        description: z.string().max(exports.Limits.BuildingBlockDescription),
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
        .refine(param => {
        return param.optional || param.supportsIncrementalSync !== false;
    }, { message: 'Required params should support incremental sync.' })
        .refine(param => {
        if (!param.allowedPresetValues) {
            return true;
        }
        return param.type === api_types_6.Type.date || ((0, api_types_7.isArrayType)(param.type) && param.type.items === api_types_6.Type.date);
    }, { message: 'allowedPresetValues is not allowed on parameters of this type.' })
        .refine(param => {
        var _a;
        if (!param.allowedPresetValues || param.type !== api_types_6.Type.date) {
            return true;
        }
        return (_a = param.allowedPresetValues) === null || _a === void 0 ? void 0 : _a.every((value) => typeof value === 'string' && api_types_1.AllPrecannedDates.includes(value));
    }, { message: 'allowedPresetValues for a date parameter can only be a list of PrecannedDate values.' })
        .refine(param => {
        var _a;
        if (!param.allowedPresetValues || !((0, api_types_7.isArrayType)(param.type) && param.type.items === api_types_6.Type.date)) {
            return true;
        }
        const relativeDateRanges = Object.values(__1.PrecannedDateRange);
        return (_a = param.allowedPresetValues) === null || _a === void 0 ? void 0 : _a.every((value) => typeof value === 'string' && relativeDateRanges.includes(value));
    }, { message: 'allowedPresetValues for a date array parameter can only be a list of PrecannedDateRange values.' });
    const commonPackFormulaSchema = {
        // It would be preferable to use validateFormulaName here, but we have to exempt legacy packs with sync tables
        // whose getter names violate the validator, and those exemptions require the pack id, so this has to be
        // done as a superRefine on the top-level object that also contains the pack id.
        name: z.string().max(exports.Limits.BuildingBlockName),
        description: z.string().max(exports.Limits.BuildingBlockDescription),
        instructions: z.string().optional(),
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
            result: z.any().refine(result => {
                return !(0, object_utils_2.isNil)(result);
            }, { message: "Pack formulas can't return null or undefined." }),
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
        connectionRequirement: z.nativeEnum(api_types_2.ConnectionRequirement).optional(),
        // TODO(jonathan): Remove after removing `network` from formula def.
        network: zodCompleteObject({
            hasSideEffect: z.boolean().optional(),
            requiresConnection: z.boolean().optional(),
            connection: z.nativeEnum(api_types_3.NetworkConnection).optional(),
        }).optional(),
        cacheTtlSecs: z.number().min(0).optional(),
        isExperimental: z.boolean().optional(),
        isSystem: z.boolean().optional(),
        extraOAuthScopes: z.array(z.string()).optional(),
        allowedAuthenticationNames: z.array(z.string()).optional(),
        // Has to be any to avoid circular dependency.
        validateParameters: z.any().optional(),
    };
    const booleanPackFormulaSchema = zodCompleteObject({
        ...commonPackFormulaSchema,
        resultType: zodDiscriminant(api_types_6.Type.boolean),
        schema: zodCompleteObject({
            type: zodDiscriminant(schema_18.ValueType.Boolean),
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
        displayName: z.string().optional(),
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
        type: zodDiscriminant(schema_18.ValueType.Boolean),
        codaType: z.enum([...schema_2.BooleanHintValueTypes]).optional(),
        ...basePropertyValidators,
    });
    const numericPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.Number),
        codaType: zodDiscriminant(schema_17.ValueHintType.Percent).optional(),
        precision: z.number().optional(),
        useThousandsSeparator: z.boolean().optional(),
        ...baseNumericPropertyValidators,
    });
    const scalePropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.Number),
        codaType: zodDiscriminant(schema_17.ValueHintType.Scale),
        maximum: z.number().optional(),
        icon: z.nativeEnum(schema_15.ScaleIconSet).optional(),
        ...baseNumericPropertyValidators,
    });
    const optionalStringOrNumber = z.union([z.number(), z.string()]).optional();
    const sliderPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.Number),
        codaType: zodDiscriminant(schema_17.ValueHintType.Slider),
        maximum: optionalStringOrNumber,
        minimum: optionalStringOrNumber,
        step: optionalStringOrNumber,
        showValue: z.boolean().optional(),
        ...baseNumericPropertyValidators,
    });
    const progressBarPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.Number),
        codaType: zodDiscriminant(schema_17.ValueHintType.ProgressBar),
        maximum: optionalStringOrNumber,
        minimum: optionalStringOrNumber,
        step: optionalStringOrNumber,
        showValue: z.boolean().optional(),
        ...baseNumericPropertyValidators,
    });
    const currencyPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.Number),
        codaType: zodDiscriminant(schema_17.ValueHintType.Currency),
        precision: z.number().optional(),
        currencyCode: z.string().optional(),
        format: z.nativeEnum(schema_4.CurrencyFormat).optional(),
        ...baseNumericPropertyValidators,
    });
    const numericDatePropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.Number),
        codaType: zodDiscriminant(schema_17.ValueHintType.Date),
        format: z.string().optional(),
        ...baseNumericPropertyValidators,
    });
    const numericTimePropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.Number),
        codaType: zodDiscriminant(schema_17.ValueHintType.Time),
        format: z.string().optional(),
        ...baseNumericPropertyValidators,
    });
    const numericDateTimePropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.Number),
        codaType: zodDiscriminant(schema_17.ValueHintType.DateTime),
        dateFormat: z.string().optional(),
        timeFormat: z.string().optional(),
        ...baseNumericPropertyValidators,
    });
    const numericDurationPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.Number),
        codaType: zodDiscriminant(schema_17.ValueHintType.Duration),
        precision: z.number().optional(),
        maxUnit: z.nativeEnum(schema_5.DurationUnit).optional(),
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
        resultType: zodDiscriminant(api_types_6.Type.number),
        schema: numberPropertySchema.optional(),
    });
    const simpleStringPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.String),
        codaType: z.enum([...schema_16.SimpleStringHintValueTypes]).optional(),
        ...baseStringPropertyValidators,
    });
    const stringDatePropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.String),
        codaType: zodDiscriminant(schema_17.ValueHintType.Date),
        format: z.string().optional(),
        ...baseStringPropertyValidators,
    });
    const stringTimePropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.String),
        codaType: zodDiscriminant(schema_17.ValueHintType.Time),
        format: z.string().optional(),
        ...baseStringPropertyValidators,
    });
    const stringDateTimePropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.String),
        codaType: zodDiscriminant(schema_17.ValueHintType.DateTime),
        dateFormat: z.string().optional(),
        timeFormat: z.string().optional(),
        ...baseStringPropertyValidators,
    });
    const durationPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.String),
        codaType: zodDiscriminant(schema_17.ValueHintType.Duration),
        precision: z.number().optional(),
        maxUnit: z.nativeEnum(schema_5.DurationUnit).optional(),
        ...baseStringPropertyValidators,
    });
    const codaInternalRichTextSchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.String),
        codaType: zodDiscriminant(schema_17.ValueHintType.CodaInternalRichText),
        isCanvas: z.boolean().optional(),
        ...baseStringPropertyValidators,
    });
    const embedPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.String),
        codaType: zodDiscriminant(schema_17.ValueHintType.Embed),
        force: z.boolean().optional(),
        ...baseStringPropertyValidators,
    });
    const emailPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.String),
        codaType: zodDiscriminant(schema_17.ValueHintType.Email),
        display: z.nativeEnum(schema_6.EmailDisplayType).optional(),
        ...baseStringPropertyValidators,
    });
    const linkPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.String),
        codaType: zodDiscriminant(schema_17.ValueHintType.Url),
        display: z.nativeEnum(schema_12.LinkDisplayType).optional(),
        force: z.boolean().optional(),
        ...baseStringPropertyValidators,
    });
    const stringWithOptionsPropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.String),
        codaType: zodDiscriminant(schema_17.ValueHintType.SelectList),
        ...baseStringPropertyValidators,
        options: zodOptionsFieldWithValues(z.string(), true),
        allowNewValues: z.boolean().optional(),
        requireForUpdates: z.boolean().optional(),
    });
    const imagePropertySchema = zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.String),
        codaType: z.union([zodDiscriminant(schema_17.ValueHintType.ImageAttachment), zodDiscriminant(schema_17.ValueHintType.ImageReference)]),
        imageOutline: z.nativeEnum(schema_8.ImageOutline).optional(),
        imageCornerStyle: z.nativeEnum(schema_7.ImageCornerStyle).optional(),
        imageShapeStyle: z.nativeEnum(schema_9.ImageShapeStyle).optional(),
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
    const stringPackFormulaSchema = zodCompleteObject({
        ...commonPackFormulaSchema,
        resultType: zodDiscriminant(api_types_6.Type.string),
        schema: stringPropertySchema.optional(),
    });
    // TODO(jonathan): Give this a better type than ZodTypeAny after figuring out
    // recursive typing better.
    const arrayPropertySchema = z.lazy(() => zodCompleteStrictObject({
        type: zodDiscriminant(schema_18.ValueType.Array),
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
        ExemptionType["FilterablePropertyLimit"] = "FilterablePropertyLimit";
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
        zodCompleteStrictObject({
            property: z.string().min(1),
            label: z.string().optional(),
            placeholder: z.string().optional(),
        }),
    ]);
    const contentCategorizationSchema = z
        .discriminatedUnion('type', [
        zodCompleteStrictObject({
            type: z.literal(schema_3.ContentCategorizationType.Messaging),
        }),
        zodCompleteStrictObject({
            type: z.literal(schema_3.ContentCategorizationType.Document),
        }),
        zodCompleteStrictObject({
            type: z.literal(schema_3.ContentCategorizationType.Email),
            toProperty: propertySchema,
            fromProperty: propertySchema,
            subjectProperty: propertySchema,
            htmlBodyProperty: propertySchema,
            plainTextBodyProperty: propertySchema,
        }),
        zodCompleteStrictObject({
            type: z.literal(schema_3.ContentCategorizationType.Comment),
        }),
    ])
        .refine(data => {
        return data.type && Object.values(schema_3.ContentCategorizationType).includes(data.type);
    }, {
        message: `must be a valid content categorization type.`,
        path: ['contentCategorization', 'type'],
    });
    const contextPropertiesSchema = z.array(propertySchema).min(1);
    const indexedPropertySchema = z.union([
        propertySchema,
        zodCompleteStrictObject({
            property: propertySchema,
            strategy: z.nativeEnum(schema_10.IndexingStrategy),
        }),
    ]);
    const filterablePropertiesSchema = z.array(propertySchema);
    const customIndexSchema = zodCompleteStrictObject({
        properties: z.array(indexedPropertySchema).min(1),
        contextProperties: contextPropertiesSchema.optional(),
        authorityNormProperty: propertySchema.optional(),
        popularityNormProperty: propertySchema.optional(),
        filterableProperties: filterablePropertiesSchema.optional(),
    });
    const categorizationIndexSchema = zodCompleteStrictObject({
        contentCategorization: contentCategorizationSchema,
        authorityNormProperty: propertySchema.optional(),
        popularityNormProperty: propertySchema.optional(),
        filterableProperties: filterablePropertiesSchema.optional(),
    });
    const indexSchema = z.union([customIndexSchema, categorizationIndexSchema]);
    const identitySchema = zodCompleteObject({
        packId: z.number().optional(),
        name: z.string().nonempty(),
        dynamicUrl: z.string().optional(),
        attribution: attributionSchema,
        mergeKey: z.string().optional(),
    });
    const parentSchema = zodCompleteStrictObject({
        parentIdProperty: propertySchema,
        lifecycle: z.nativeEnum(schema_11.LifecycleBehavior).optional(),
        permissions: z.nativeEnum(schema_14.PermissionsBehavior).optional(),
    });
    const genericObjectSchema = z.lazy(() => zodCompleteObject({
        ...basePropertyValidators,
        type: zodDiscriminant(schema_18.ValueType.Object),
        description: z.string().optional(),
        id: z.string().min(1).optional(),
        idProperty: z.string().min(1).optional(),
        primary: z.string().min(1).optional(),
        displayProperty: z.string().min(1).optional(),
        codaType: z.enum([...schema_13.ObjectHintValueTypes]).optional(),
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
        const validatePropertyValue = makePropertyValidator(schema, context);
        function validateProperty(fieldName, isValidSchema, invalidSchemaMessage) {
            validatePropertyValue(schema[fieldName], fieldName, isValidSchema, invalidSchemaMessage);
        }
        const validateTitleProperty = () => {
            return validateProperty('titleProperty', propertySchema => [schema_18.ValueType.String, schema_18.ValueType.Object].includes(propertySchema.type), `must refer to a "ValueType.String" or "ValueType.Object" property.`);
        };
        const validateImageProperty = () => {
            return validateProperty('imageProperty', imagePropertySchema => imagePropertySchema.type === schema_18.ValueType.String &&
                [schema_17.ValueHintType.ImageAttachment, schema_17.ValueHintType.ImageReference].includes(imagePropertySchema.codaType), `must refer to a "ValueType.String" property with a "ValueHintType.ImageAttachment" or "ValueHintType.ImageReference" "codaType".`);
        };
        const validateSnippetProperty = () => {
            return validateProperty('snippetProperty', snippetPropertySchema => snippetPropertySchema.type === schema_18.ValueType.String ||
                (snippetPropertySchema.type === schema_18.ValueType.Array && snippetPropertySchema.items.type === schema_18.ValueType.String), `must refer to a "ValueType.String" property or array of strings.`);
        };
        const validateLinkProperty = () => {
            return validateProperty('linkProperty', linkPropertySchema => linkPropertySchema.type === schema_18.ValueType.String && linkPropertySchema.codaType === schema_17.ValueHintType.Url, `must refer to a "ValueType.String" property with a "ValueHintType.Url" "codaType".`);
        };
        const validateSubtitleProperties = () => {
            return validateProperty('subtitleProperties', subtitlePropertySchema => {
                if (!('codaType' in subtitlePropertySchema && subtitlePropertySchema.codaType)) {
                    return true;
                }
                switch (subtitlePropertySchema.codaType) {
                    case schema_17.ValueHintType.ImageAttachment:
                    case schema_17.ValueHintType.Attachment:
                    case schema_17.ValueHintType.ImageReference:
                    case schema_17.ValueHintType.Embed:
                    case schema_17.ValueHintType.Scale:
                        return false;
                    case schema_17.ValueHintType.CodaInternalRichText:
                    case schema_17.ValueHintType.Currency:
                    case schema_17.ValueHintType.Date:
                    case schema_17.ValueHintType.DateTime:
                    case schema_17.ValueHintType.Duration:
                    case schema_17.ValueHintType.Email:
                    case schema_17.ValueHintType.Html:
                    case schema_17.ValueHintType.Markdown:
                    case schema_17.ValueHintType.Percent:
                    case schema_17.ValueHintType.Person:
                    case schema_17.ValueHintType.ProgressBar:
                    case schema_17.ValueHintType.Reference:
                    case schema_17.ValueHintType.SelectList:
                    case schema_17.ValueHintType.Slider:
                    case schema_17.ValueHintType.Toggle:
                    case schema_17.ValueHintType.Time:
                    case schema_17.ValueHintType.Url:
                        return true;
                    default:
                        (0, ensure_2.ensureUnreachable)(subtitlePropertySchema.codaType);
                }
            }, `must refer to a value that does not have a codaType corresponding to one of ImageAttachment, Attachment, ImageReference, Embed, or Scale.`);
        };
        const validateCreatedAtProperty = () => {
            return validateProperty('createdAtProperty', createdAtPropertySchema => (createdAtPropertySchema.type === schema_18.ValueType.String ||
                createdAtPropertySchema.type === schema_18.ValueType.Number) &&
                (createdAtPropertySchema.codaType === schema_17.ValueHintType.DateTime ||
                    createdAtPropertySchema.codaType === schema_17.ValueHintType.Date), `must refer to a "ValueType.String" or "ValueType.Number" property with a "ValueHintType.DateTime" or "ValueHintType.Date" "codaType".`);
        };
        const validateModifiedAtProperty = () => {
            return validateProperty('modifiedAtProperty', modifiedAtPropertySchema => (modifiedAtPropertySchema.type === schema_18.ValueType.String ||
                modifiedAtPropertySchema.type === schema_18.ValueType.Number) &&
                (modifiedAtPropertySchema.codaType === schema_17.ValueHintType.DateTime ||
                    modifiedAtPropertySchema.codaType === schema_17.ValueHintType.Date), `must refer to a "ValueType.String" or "ValueType.Number" property with a "ValueHintType.DateTime" or "ValueHintType.Date" "codaType".`);
        };
        const validateCreatedByProperty = () => {
            return validateProperty('createdByProperty', createdByPropertySchema => (createdByPropertySchema.type === schema_18.ValueType.Object ||
                createdByPropertySchema.type === schema_18.ValueType.String) &&
                (createdByPropertySchema.codaType === schema_17.ValueHintType.Person ||
                    createdByPropertySchema.codaType === schema_17.ValueHintType.Email), `must refer to a "ValueType.Object" or "ValueType.String" property with a "ValueHintType.Person" or "ValueHintType.Email" "codaType".`);
        };
        const validateModifiedByProperty = () => {
            return validateProperty('modifiedByProperty', modifiedByPropertySchema => (modifiedByPropertySchema.type === schema_18.ValueType.Object ||
                modifiedByPropertySchema.type === schema_18.ValueType.String) &&
                (modifiedByPropertySchema.codaType === schema_17.ValueHintType.Person ||
                    modifiedByPropertySchema.codaType === schema_17.ValueHintType.Email), `must refer to a "ValueType.Object" or "ValueType.String" property with a "ValueHintType.Person" or "ValueHintType.Email" "codaType".`);
        };
        const validateUserEmailProperty = () => {
            return validateProperty('userEmailProperty', userEmail => (userEmail.type === schema_18.ValueType.String && userEmail.codaType === schema_17.ValueHintType.Email) ||
                (userEmail.type === schema_18.ValueType.Object && userEmail.codaType === schema_17.ValueHintType.Person), `must refer to a "ValueType.Object" or "ValueType.String" property with a "ValueHintType.Person" or "ValueHintType.Email" "codaType".`);
        };
        const validateUserIdProperty = () => {
            return validateProperty('userIdProperty', userIdPropertySchema => userIdPropertySchema.type === schema_18.ValueType.String || userIdPropertySchema.type === schema_18.ValueType.Number, `must refer to a "ValueType.String" or "ValueType.Number".`);
        };
        const validateGroupIdProperty = () => {
            return validateProperty('groupIdProperty', groupIdPropertySchema => groupIdPropertySchema.type === schema_18.ValueType.String || groupIdPropertySchema.type === schema_18.ValueType.Number, `must refer to a "ValueType.String" or "ValueType.Number".`);
        };
        const validateMemberGroupIdProperty = () => {
            return validateProperty('memberGroupIdProperty', memberGroupIdPropertySchema => memberGroupIdPropertySchema.type === schema_18.ValueType.String ||
                memberGroupIdPropertySchema.type === schema_18.ValueType.Number, `must refer to a "ValueType.String" or "ValueType.Number".`);
        };
        const validateVersionProperty = () => {
            return validateProperty('versionProperty', versionPropertySchema => versionPropertySchema.type === schema_18.ValueType.String, `must refer to a "ValueType.String" property.`);
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
        var _a;
        const schemaHelper = (0, migration_1.objectSchemaHelper)(data);
        const internalRichTextPropertyTuple = Object.entries(schemaHelper.properties).find(([_key, prop]) => prop.type === schema_18.ValueType.String && prop.codaType === schema_17.ValueHintType.CodaInternalRichText);
        if (internalRichTextPropertyTuple && !isValidUseOfCodaInternalRichText((_a = data.identity) === null || _a === void 0 ? void 0 : _a.packId)) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['identity', 'properties', internalRichTextPropertyTuple[0]],
                message: 'Invalid codaType. CodaInternalRichText is not a supported value.',
            });
            return;
        }
    })
        .superRefine((data, context) => {
        const schema = data;
        if (!schema.index) {
            return;
        }
        const validatePropertyValue = makePropertyValidator(schema, context);
        const { authorityNormProperty, popularityNormProperty, filterableProperties } = schema.index;
        // validate the categorization index
        if ((0, schema_20.isCategorizationIndexDefinition)(schema.index)) {
            const { contentCategorization } = schema.index;
            const { type } = contentCategorization;
            if (type === schema_3.ContentCategorizationType.Email) {
                const { toProperty, fromProperty, subjectProperty, htmlBodyProperty, plainTextBodyProperty } = contentCategorization;
                validatePropertyValue(toProperty, 'toProperty', property => property.type === schema_18.ValueType.String, `must be a valid property.`, ['index', 'contentCategorization', 'toProperty']);
                validatePropertyValue(fromProperty, 'fromProperty', property => property.type === schema_18.ValueType.String, `must be a valid property.`, ['index', 'contentCategorization', 'fromProperty']);
                validatePropertyValue(subjectProperty, 'subjectProperty', property => property.type === schema_18.ValueType.String, `must be a valid property.`, ['index', 'contentCategorization', 'subjectProperty']);
                validatePropertyValue(htmlBodyProperty, 'htmlBodyProperty', property => property.type === schema_18.ValueType.String, `must be a valid property.`, ['index', 'contentCategorization', 'htmlBodyProperty']);
                validatePropertyValue(plainTextBodyProperty, 'plainTextBodyProperty', property => property.type === schema_18.ValueType.String, `must be a valid property.`, ['index', 'contentCategorization', 'plainTextBodyProperty']);
            }
            // validate the custom index
        }
        else {
            const { properties, contextProperties } = schema.index;
            for (let i = 0; i < properties.length; i++) {
                const indexedProperty = properties[i];
                const objectPath = ['index', 'properties', i];
                if (typeof indexedProperty === 'string') {
                    validatePropertyValue(indexedProperty, 'properties', indexedPropertySchema => indexedPropertySchema.type === schema_18.ValueType.String ||
                        (indexedPropertySchema.type === schema_18.ValueType.Array &&
                            indexedPropertySchema.items.type === schema_18.ValueType.String), `must refer to a "ValueType.String" property or a "ValueType.Array" array of "ValueType.String" properties.`, objectPath);
                }
                else {
                    validatePropertyValue(indexedProperty.property, 'properties', indexedPropertySchema => indexedPropertySchema.type === schema_18.ValueType.String ||
                        (indexedPropertySchema.type === schema_18.ValueType.Array &&
                            indexedPropertySchema.items.type === schema_18.ValueType.String), `must refer to a "ValueType.String" property or a "ValueType.Array" array of "ValueType.String" properties.`, [...objectPath, 'property']);
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
            validatePropertyValue(authorityNormProperty, 'authorityNormProperty', authorityNormPropertySchema => authorityNormPropertySchema.type === schema_18.ValueType.Number, `must refer to a "ValueType.Number" property.`, ['index', 'authorityNormProperty']);
        }
        if (popularityNormProperty) {
            validatePropertyValue(popularityNormProperty, 'popularityNormProperty', popularityNormPropertySchema => popularityNormPropertySchema.type === schema_18.ValueType.Number, `must refer to a "ValueType.Number" property.`, ['index', 'popularityNormProperty']);
        }
        if (filterableProperties) {
            for (let i = 0; i < filterableProperties.length; i++) {
                const filterableProperty = filterableProperties[i];
                const objectPath = ['index', 'filterableProperty', i];
                validatePropertyValue(filterableProperty, 'filterableProperty', filterablePropertySchema => {
                    function isUserSchema(schema) {
                        return Boolean(schema.type === schema_18.ValueType.Object &&
                            (schema.codaType === schema_17.ValueHintType.Person || schema.userEmailProperty || schema.userIdProperty));
                    }
                    if (filterablePropertySchema.type === schema_18.ValueType.Array) {
                        return ([schema_18.ValueType.Number, schema_18.ValueType.String].includes(filterablePropertySchema.items.type) ||
                            isUserSchema(filterablePropertySchema.items));
                    }
                    return ([schema_18.ValueType.Boolean, schema_18.ValueType.Number, schema_18.ValueType.String].includes(filterablePropertySchema.type) ||
                        isUserSchema(filterablePropertySchema));
                }, `must be a "ValueType.Boolean", "ValueType.Number", "ValueType.String", "ValueHintType.Person" or an object that has userEmailProperty, userIdProperty specified or an array of "ValueType.Number" or "ValueType.String" or an array of "ValueHintType.Person" or objects that have userEmailProperty, userIdProperty specified.`, objectPath);
            }
        }
    })
        .superRefine((data, context) => {
        const schema = data;
        if (!schema.index ||
            !schema.index.filterableProperties ||
            schema.index.filterableProperties.length <= exports.Limits.FilterableProperties) {
            return;
        }
        // Ignore property limit if specified.
        if (Exemptions.some(exemption => {
            var _a, _b;
            return exemption[0] === ((_a = schema.identity) === null || _a === void 0 ? void 0 : _a.packId) &&
                exemption[1] === ((_b = schema.identity) === null || _b === void 0 ? void 0 : _b.name) &&
                exemption[2] === ExemptionType.FilterablePropertyLimit;
        })) {
            return;
        }
        context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['index', 'filterableProperties'],
            message: `Array must contain at most ${exports.Limits.FilterableProperties} element(s)`,
        });
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
        const schemaForOptions = (0, schema_24.maybeUnwrapArraySchema)(schema);
        const result = !schemaForOptions ||
            (0, schema_26.unwrappedSchemaSupportsOptions)(schemaForOptions) ||
            !('options' in schemaForOptions && schemaForOptions.options);
        return result;
    }, 'You must set "codaType" to ValueHintType.SelectList or ValueHintType.Reference when setting an "options" property.');
    const objectPackFormulaSchema = zodCompleteObject({
        ...commonPackFormulaSchema,
        resultType: zodDiscriminant(api_types_6.Type.object),
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
    })
        .refine(val => {
        return !val.validateParameters;
    }, { message: 'validateParameters is only allowed on sync formulas.' });
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
        maxPermissionBatchSize: z.number().min(1).max(exports.Limits.PermissionsBatchSize).optional(),
        supportsGetPermissions: z.boolean().optional(),
    });
    const baseSyncTableSchema = {
        name: z
            .string()
            .nonempty()
            .max(exports.Limits.BuildingBlockName)
            .regex(regexFormulaName, 'Sync Table names can only contain alphanumeric characters and underscores.'),
        displayName: z.string().max(exports.Limits.BuildingBlockName).optional(),
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
        role: z.nativeEnum(api_types_5.TableRole).optional(),
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
    const packToolSchema = zodCompleteStrictObject({
        type: z.literal(types_9.ToolType.Pack),
        packId: z.number().optional(),
        formulas: z
            .array(zodCompleteStrictObject({
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
        }))
            .optional(),
    });
    const knowledgeToolSourceSchema = z.discriminatedUnion('type', [
        z.object({
            type: z.literal(types_3.KnowledgeToolSourceType.Global),
        }),
        z.object({
            type: z.literal(types_3.KnowledgeToolSourceType.Pack),
            packId: z.number().optional(),
        }),
    ]);
    const knowledgeToolSchema = zodCompleteStrictObject({
        type: z.literal(types_9.ToolType.Knowledge),
        source: knowledgeToolSourceSchema,
    });
    const screenAnnotationSchema = z.discriminatedUnion('type', [
        z.object({
            type: z.literal(types_7.ScreenAnnotationType.Rewrite),
        }),
        z.object({
            type: z.literal(types_7.ScreenAnnotationType.Guide),
        }),
    ]);
    const screenAnnotationToolSchema = zodCompleteStrictObject({
        type: z.literal(types_9.ToolType.ScreenAnnotation),
        annotation: screenAnnotationSchema,
    });
    const assistantMessageToolSchema = zodCompleteStrictObject({
        type: z.literal(types_9.ToolType.AssistantMessage),
    });
    const summarizerToolSchema = zodCompleteStrictObject({
        type: z.literal(types_9.ToolType.Summarizer),
    });
    const toolSchema = z.discriminatedUnion('type', [
        packToolSchema,
        knowledgeToolSchema,
        screenAnnotationToolSchema,
        assistantMessageToolSchema,
        summarizerToolSchema,
    ]);
    const skillSchema = zodCompleteObject({
        name: z
            .string()
            .min(1)
            .max(exports.Limits.BuildingBlockName)
            .regex(regexParameterName, 'Skill names can only contain alphanumeric characters and underscores.'),
        displayName: z.string().min(1).max(exports.Limits.BuildingBlockName),
        description: z.string().min(1).max(exports.Limits.BuildingBlockDescription),
        prompt: z.string().min(1).max(exports.Limits.PromptLength),
        tools: z.array(toolSchema),
    });
    const skillEntrypointConfigSchema = zodCompleteStrictObject({
        skillName: z.string(),
    });
    const skillEntrypointsSchema = zodCompleteStrictObject({
        benchInitialization: skillEntrypointConfigSchema.optional(),
        defaultChat: skillEntrypointConfigSchema.optional(),
    });
    // Make sure to call the refiners on this after removing legacyPackMetadataSchema.
    // (Zod doesn't let you call .extends() after you've called .refine(), so we're only refining the top-level
    // schema we actually use.)
    const unrefinedPackVersionMetadataSchema = zodCompleteObject({
        version: z
            .string()
            .regex(/^\d+(\.\d+){0,2}(\-prerelease\.\d+)?$/, 'Pack versions must use semantic versioning, e.g. "1", "1.0" or "1.0.0".')
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
        adminAuthentications: z.array(adminAuthenticationValidator).optional(),
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
            const identityInfo = new Map();
            const formulaNames = [];
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
                    const allowedAuthenticationNames = identityInfo.get(tableDef.schema.identity.name) || [];
                    identityInfo.set(tableDef.schema.identity.name, [
                        ...allowedAuthenticationNames,
                        ...(((_b = tableDef.getter) === null || _b === void 0 ? void 0 : _b.allowedAuthenticationNames) || [undefined]),
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
            .max(exports.Limits.MaxSkillCount)
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
    function validateIdentityNames(context, identityInfo) {
        for (const [identityName, allowedAuthenticationNames] of identityInfo) {
            const seenAuthNames = new Set();
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
            .superRefine((untypedMetadata, context) => {
            var _a;
            const metadata = untypedMetadata;
            for (const authInfo of getAuthentications(metadata)) {
                const { name, authentication } = authInfo;
                if (authentication.type !== types_1.AuthenticationType.CodaApiHeaderBearerToken) {
                    return;
                }
                const codaDomains = ['coda.io', 'localhost'];
                const hasNonCodaNetwork = (_a = metadata.networkDomains) === null || _a === void 0 ? void 0 : _a.some((domain) => !codaDomains.includes(domain));
                if (!hasNonCodaNetwork) {
                    continue;
                }
                const authDomains = getDeclaredAuthNetworkDomains(authentication);
                if (!(authDomains === null || authDomains === void 0 ? void 0 : authDomains.length)) {
                    // A non-Coda network domain without auth domain restriction isn't allowed.
                    context.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [`authentication.${name}.networkDomain`],
                        message: `CodaApiHeaderBearerToken can only be used for coda.io domains. Restrict ${name}'s "networkDomain" to coda.io`,
                    });
                    continue;
                }
                const hasNonCodaAuthDomain = authDomains.some((domain) => !codaDomains.includes(domain));
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
            if (data.defaultAuthentication && data.defaultAuthentication.type !== types_1.AuthenticationType.None) {
                return;
            }
            // if the pack has no default authentication, make sure all formulas don't set connection requirements.
            // TODO(patrick): Consider allowing a pack to *only* use admin authentications.
            (data.formulas || []).forEach((formula, i) => {
                if (formula.connectionRequirement && formula.connectionRequirement !== api_types_2.ConnectionRequirement.None) {
                    context.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['formulas', i],
                        message: 'Formulas cannot set a connectionRequirement when the Pack does not use user authentication.',
                    });
                }
            });
            (data.syncTables || []).forEach((syncTable, i) => {
                const connectionRequirement = syncTable.getter.connectionRequirement;
                if (connectionRequirement && connectionRequirement !== api_types_2.ConnectionRequirement.None) {
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
        })
            .superRefine((data, context) => {
            const metadata = data;
            const { formulas, syncTables } = metadata;
            const allFormulas = [...formulas, ...syncTables.map(table => table.getter)];
            const authNames = getAuthentications(metadata).map(authInfo => authInfo.name);
            for (const formula of allFormulas) {
                const { allowedAuthenticationNames } = formula;
                if (!allowedAuthenticationNames) {
                    continue;
                }
                if (formula.connectionRequirement === api_types_2.ConnectionRequirement.None) {
                    context.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [formula.name, 'allowedAuthenticationNames'],
                        message: `Cannot specify 'allowedAuthenticationNames' on a formula with 'ConnectionRequirement.None'`,
                    });
                }
                for (const allowedAuthenticationName of allowedAuthenticationNames) {
                    if (!authNames.includes(allowedAuthenticationName) &&
                        !reservedAuthenticationNames.includes(allowedAuthenticationName)) {
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
            const metadata = data;
            const { syncTables } = metadata;
            const authentications = getAuthentications(metadata);
            const authNames = authentications.map(authInfo => authInfo.name);
            for (const syncTable of syncTables) {
                const { getter } = syncTable;
                let { allowedAuthenticationNames } = getter;
                // TODO(patrick): Better typing
                if (!(0, api_1.isSyncPackFormula)(getter)) {
                    continue;
                }
                const { supportsGetPermissions } = getter;
                if (!supportsGetPermissions) {
                    continue;
                }
                // If no auth names are explicitly allowed, then all are assumed to be allowed.
                if (!allowedAuthenticationNames) {
                    allowedAuthenticationNames = authNames;
                }
                for (const auth of authentications) {
                    const { name } = auth;
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
        category: z.nativeEnum(types_4.PackCategory).optional(),
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
        const { syncTables } = data;
        if (syncTables) {
            validateCrawlHierarchy(syncTables, context);
            validateParents(syncTables, context);
        }
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
        var _a;
        const authentications = getAuthentications(data);
        if (((_a = data.networkDomains) === null || _a === void 0 ? void 0 : _a.length) ||
            authentications.every(auth => auth.authentication.type === types_1.AuthenticationType.None ||
                // Various is an internal authentication type that's only applicable to whitelisted Pack Ids.
                // Skipping validation here to let it exempt from network domains.
                auth.authentication.type === types_1.AuthenticationType.Various ||
                (auth.authentication.requiresEndpointUrl && !auth.authentication.endpointDomain))) {
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
        for (const authInfo of getAuthentications(data)) {
            const { name, authentication } = authInfo;
            const authNetworkDomains = getDeclaredAuthNetworkDomains(authentication);
            if (!(0, object_utils_1.isDefined)(authNetworkDomains)) {
                // This is a Various or None auth pack.
                return;
            }
            const readableAuthTitle = name === types_6.ReservedAuthenticationNames.Default ? 'setUserAuthentication()' : `authentication ${name}`;
            // Auth network domains must match pack network domains.
            for (const authNetworkDomain of authNetworkDomains) {
                if (!((_a = data.networkDomains) === null || _a === void 0 ? void 0 : _a.includes(authNetworkDomain))) {
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
        const data = untypedData;
        if (!data.networkDomains) {
            return;
        }
        for (const authInfo of getAuthentications(data)) {
            const { name, authentication } = authInfo;
            const readableAuthTitle = name === types_6.ReservedAuthenticationNames.Default ? 'setUserAuthentication()' : `authentication ${name}`;
            const usedNetworkDomains = getUsedAuthNetworkDomains(authentication);
            if (usedNetworkDomains) {
                for (const usedNetworkDomain of usedNetworkDomains) {
                    if (!data.networkDomains.some(domain => domain === usedNetworkDomain || usedNetworkDomain.endsWith('.' + domain))) {
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
        const data = untypedData;
        for (const authInfo of getAuthentications(data)) {
            const { name, authentication } = authInfo;
            const authNetworkDomains = getDeclaredAuthNetworkDomains(authentication);
            if (!(0, object_utils_1.isDefined)(authNetworkDomains)) {
                // This is a Various or None auth pack.
                return;
            }
            const readableAuthTitle = name === types_6.ReservedAuthenticationNames.Default ? 'setUserAuthentication()' : `authentication ${name}`;
            // A pack with multiple networks and auth must choose which domain(s) get auth on them.
            if (!(authNetworkDomains === null || authNetworkDomains === void 0 ? void 0 : authNetworkDomains.length)) {
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
        const data = untypedData;
        (data.syncTables || []).forEach((syncTable, i) => {
            const schema = syncTable.schema;
            for (const [propertyName, childSchema] of Object.entries(schema.properties)) {
                const options = (0, schema_23.maybeSchemaOptionsValue)(childSchema);
                if (!options || Array.isArray(options)) {
                    continue;
                }
                if (typeof options !== 'string' || !(options in (syncTable.namedPropertyOptions || {}))) {
                    context.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['syncTables', i, 'properties', propertyName, 'options'],
                        message: options === api_types_4.OptionsType.Dynamic
                            ? `Sync table ${syncTable.name} must define "options" for this property to use OptionsType.Dynamic`
                            : `"${options}" is not registered as an options function for this sync table.`,
                    });
                    continue;
                }
            }
        });
    })
        .superRefine((data, context) => {
        const metadata = data;
        const { skills, skillEntrypoints } = metadata;
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
    return { legacyPackMetadataSchema, variousSupportedAuthenticationValidators, arrayPropertySchema };
}
function getAuthentications(data) {
    const authentications = [];
    if (data.defaultAuthentication) {
        authentications.push({ name: types_6.ReservedAuthenticationNames.Default, authentication: data.defaultAuthentication });
    }
    if (data.systemConnectionAuthentication) {
        authentications.push({
            name: types_6.ReservedAuthenticationNames.System,
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
function getUsedAuthNetworkDomains(authentication, includeOAuthTokenUrls = false) {
    if (authentication.type === types_1.AuthenticationType.None || authentication.type === types_1.AuthenticationType.Various) {
        return undefined;
    }
    const { endpointDomain, type } = authentication;
    const domains = [];
    if (endpointDomain) {
        domains.push(endpointDomain);
    }
    if (!includeOAuthTokenUrls) {
        return domains;
    }
    switch (type) {
        case types_1.AuthenticationType.OAuth2: {
            const { authorizationUrl, tokenUrl } = authentication;
            const parsedAuthUrl = (0, url_parse_1.default)(authorizationUrl);
            if (parsedAuthUrl.hostname) {
                domains.push(parsedAuthUrl.hostname);
            }
            const parsedTokenUrl = (0, url_parse_1.default)(tokenUrl);
            if (parsedTokenUrl.hostname) {
                domains.push(parsedTokenUrl.hostname);
            }
            return domains;
        }
        case types_1.AuthenticationType.OAuth2ClientCredentials: {
            const { tokenUrl } = authentication;
            if (endpointDomain) {
                domains.push(endpointDomain);
            }
            const parsedTokenUrl = (0, url_parse_1.default)(tokenUrl);
            if (parsedTokenUrl.hostname) {
                domains.push(parsedTokenUrl.hostname);
            }
            return domains;
        }
        case types_1.AuthenticationType.AWSAccessKey:
        case types_1.AuthenticationType.AWSAssumeRole:
        case types_1.AuthenticationType.CodaApiHeaderBearerToken:
        case types_1.AuthenticationType.Custom:
        case types_1.AuthenticationType.CustomHeaderToken:
        case types_1.AuthenticationType.GoogleDomainWideDelegation:
        case types_1.AuthenticationType.GoogleServiceAccount:
        case types_1.AuthenticationType.HeaderBearerToken:
        case types_1.AuthenticationType.MultiHeaderToken:
        case types_1.AuthenticationType.MultiQueryParamToken:
        case types_1.AuthenticationType.QueryParamToken:
        case types_1.AuthenticationType.WebBasic:
            return domains;
        default:
            (0, ensure_2.ensureUnreachable)(type);
    }
}
// Returns undefined for None or Various auth, otherwise returns a string array.
function getDeclaredAuthNetworkDomains(authentication) {
    if (authentication.type === types_1.AuthenticationType.Various || authentication.type === types_1.AuthenticationType.None) {
        return undefined;
    }
    if (Array.isArray(authentication.networkDomain)) {
        return authentication.networkDomain;
    }
    else if (authentication.networkDomain) {
        return [authentication.networkDomain];
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
                for (const auth of getAuthentications(data)) {
                    const { authentication, name } = auth;
                    if (authentication && authentication.type !== types_1.AuthenticationType.None && authentication.postSetup) {
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
function validateSchemaDeprecatedFields(schema, pathPrefix, context) {
    if ((0, schema_21.isObject)(schema)) {
        validateObjectSchemaDeprecatedFields(schema, pathPrefix, context);
    }
    if ((0, schema_19.isArray)(schema)) {
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
function isAbsoluteUrl(url) {
    return url.startsWith('https://');
}
function parseDomainName(url) {
    if (!isAbsoluteUrl(url)) {
        return;
    }
    const parsed = (0, url_parse_1.default)(url);
    return parsed.hostname;
}
function validateUrlParsesIfAbsolute(url) {
    if (!isAbsoluteUrl(url)) {
        return true;
    }
    return Boolean(parseDomainName(url));
}
