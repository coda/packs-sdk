"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaffoldPlugin = exports.assertPluginName = exports.formatPluginPublishPlan = exports.planPluginPublish = exports.validatePluginListing = exports.loadPluginListing = exports.PluginListingError = exports.PluginListingSchema = exports.PluginListingFileName = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
exports.PluginListingFileName = 'plugin.json';
const ConnectorVisibility = zod_1.z.enum(['private', 'public']);
const ComponentName = zod_1.z.string().regex(/^[a-z][a-z0-9-]*$/, 'Component names must be kebab-case.');
const ComponentReferences = zod_1.z
    .array(ComponentName)
    .refine(references => new Set(references).size === references.length, 'Component references must be unique.');
const RelativeManifestPath = zod_1.z
    .string()
    .min(1)
    .refine(manifestPath => !path_1.default.isAbsolute(manifestPath), 'Manifest paths must be relative.')
    .refine(manifestPath => !path_1.default.normalize(manifestPath).split(path_1.default.sep).includes('..'), 'Manifest paths cannot leave the plugin directory.');
const AgentComponentSchema = zod_1.z
    .object({
    type: zod_1.z.literal('agent'),
    manifest: RelativeManifestPath,
    uses: ComponentReferences.default([]),
})
    .strict();
const ConnectorComponentSchema = zod_1.z
    .object({
    type: zod_1.z.literal('connector'),
    manifest: RelativeManifestPath,
    visibility: ConnectorVisibility,
    usedBy: ComponentReferences.refine(references => references.length > 0, 'usedBy cannot be empty.').optional(),
})
    .strict();
const StarterPromptSchema = zod_1.z
    .object({
    name: ComponentName,
    prompt: zod_1.z.string().min(1),
})
    .strict();
const TestCaseSchema = zod_1.z
    .object({
    name: ComponentName,
    prompt: zod_1.z.string().min(1),
    expectedBehavior: zod_1.z.string().min(1),
})
    .strict();
exports.PluginListingSchema = zod_1.z
    .object({
    schemaVersion: zod_1.z.literal(1),
    name: zod_1.z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Plugin name must be kebab-case (e.g. radical-candor).'),
    displayName: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    entrypoints: ComponentReferences.refine(references => references.length > 0, 'A plugin needs an entrypoint.'),
    components: zod_1.z.record(ComponentName, zod_1.z.discriminatedUnion('type', [AgentComponentSchema, ConnectorComponentSchema])),
    setup: RelativeManifestPath.optional(),
    starterPrompts: zod_1.z.array(StarterPromptSchema).default([]),
    testCases: zod_1.z
        .object({
        positive: zod_1.z.array(TestCaseSchema).default([]),
        negative: zod_1.z.array(TestCaseSchema).default([]),
    })
        .strict()
        .default({ positive: [], negative: [] }),
})
    .strict();
class PluginListingError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PluginListingError';
    }
}
exports.PluginListingError = PluginListingError;
function loadPluginListing(pluginJsonPath) {
    if (!fs_1.default.existsSync(pluginJsonPath)) {
        throw new PluginListingError(`No ${exports.PluginListingFileName} at ${pluginJsonPath}.`);
    }
    let parsed;
    try {
        parsed = JSON.parse(fs_1.default.readFileSync(pluginJsonPath, 'utf8'));
    }
    catch (err) {
        const detail = err instanceof Error ? err.message : String(err);
        throw new PluginListingError(`Invalid JSON in ${pluginJsonPath}: ${detail}`);
    }
    const result = exports.PluginListingSchema.safeParse(parsed);
    if (!result.success) {
        throw new PluginListingError(result.error.issues.map(issue => issue.message).join('; '));
    }
    return result.data;
}
exports.loadPluginListing = loadPluginListing;
function validatePluginListing(listing, pluginRoot) {
    var _a, _b;
    const entries = Object.entries(listing.components);
    if (entries.length === 0) {
        throw new PluginListingError('A plugin needs at least one component.');
    }
    for (const entrypoint of listing.entrypoints) {
        if (!listing.components[entrypoint]) {
            throw new PluginListingError(`Entrypoint does not exist: ${entrypoint}`);
        }
    }
    assertUniqueNames(listing.starterPrompts.map(prompt => prompt.name), 'starter prompt');
    assertUniqueNames([...listing.testCases.positive, ...listing.testCases.negative].map(testCase => testCase.name), 'test case');
    const pluginRootRealPath = fs_1.default.realpathSync(pluginRoot);
    if (listing.setup) {
        validatePluginFile('Setup instructions', listing.setup, pluginRoot, pluginRootRealPath);
    }
    const seenManifests = new Set();
    for (const [componentName, component] of entries) {
        const manifestRealPath = validatePluginFile(`Manifest for ${componentName}`, component.manifest, pluginRoot, pluginRootRealPath);
        if (seenManifests.has(manifestRealPath)) {
            throw new PluginListingError(`Manifest is used by more than one component: ${component.manifest}`);
        }
        seenManifests.add(manifestRealPath);
        if (component.type === 'agent') {
            for (const dependency of component.uses) {
                const dependencyComponent = listing.components[dependency];
                if (!dependencyComponent) {
                    throw new PluginListingError(`Agent ${componentName} uses missing component: ${dependency}`);
                }
                if (dependencyComponent.type !== 'connector') {
                    throw new PluginListingError(`Agent ${componentName} can only use connector components.`);
                }
                if (dependencyComponent.visibility === 'private' && !((_a = dependencyComponent.usedBy) === null || _a === void 0 ? void 0 : _a.includes(componentName))) {
                    throw new PluginListingError(`Agent ${componentName} uses private connector ${dependency}, but the connector does not allow it.`);
                }
            }
            continue;
        }
        if (component.visibility === 'private') {
            const consumers = (_b = component.usedBy) !== null && _b !== void 0 ? _b : [];
            if (consumers.length === 0) {
                throw new PluginListingError(`Private connector ${componentName} needs usedBy (e.g. ["agent"]).`);
            }
            for (const consumer of consumers) {
                const consumerComponent = listing.components[consumer];
                if (!consumerComponent) {
                    throw new PluginListingError(`Private connector ${componentName} references missing component: ${consumer}`);
                }
                if (consumerComponent.type !== 'agent') {
                    throw new PluginListingError(`Private connector ${componentName} can only be used by agent components.`);
                }
            }
        }
        else if (component.usedBy) {
            throw new PluginListingError(`Public connector ${componentName} cannot set usedBy.`);
        }
    }
}
exports.validatePluginListing = validatePluginListing;
function assertUniqueNames(names, label) {
    const seen = new Set();
    for (const name of names) {
        if (seen.has(name)) {
            throw new PluginListingError(`Duplicate ${label} name: ${name}`);
        }
        seen.add(name);
    }
}
function validatePluginFile(label, relativePath, pluginRoot, pluginRootRealPath) {
    const absolutePath = path_1.default.resolve(pluginRoot, relativePath);
    if (!fs_1.default.existsSync(absolutePath) || !fs_1.default.statSync(absolutePath).isFile()) {
        throw new PluginListingError(`${label} is missing: ${relativePath}`);
    }
    const realPath = fs_1.default.realpathSync(absolutePath);
    if (!isWithinDirectory(realPath, pluginRootRealPath)) {
        throw new PluginListingError(`${label} leaves the plugin directory.`);
    }
    return realPath;
}
function isWithinDirectory(candidatePath, directoryPath) {
    const relativePath = path_1.default.relative(directoryPath, candidatePath);
    return relativePath !== '..' && !relativePath.startsWith(`..${path_1.default.sep}`) && !path_1.default.isAbsolute(relativePath);
}
function planPluginPublish(pluginJsonPath) {
    var _a;
    const pluginRoot = path_1.default.dirname(pluginJsonPath);
    const listing = loadPluginListing(pluginJsonPath);
    validatePluginListing(listing, pluginRoot);
    const uploads = [];
    const connectorPolicies = [];
    const installBindings = [];
    for (const [componentName, component] of Object.entries(listing.components)) {
        uploads.push({
            componentName,
            kind: component.type,
            manifestPath: component.manifest,
        });
        if (component.type === 'agent') {
            installBindings.push(...component.uses.map(connector => ({
                agent: componentName,
                connector,
            })));
        }
        else {
            connectorPolicies.push({
                connector: componentName,
                visibility: component.visibility,
                allowedConsumers: (_a = component.usedBy) !== null && _a !== void 0 ? _a : [],
            });
        }
    }
    return {
        name: listing.name,
        displayName: listing.displayName,
        description: listing.description,
        entrypoints: listing.entrypoints,
        uploads,
        connectorPolicies,
        installBindings,
        setup: listing.setup,
        starterPromptCount: listing.starterPrompts.length,
        positiveTestCount: listing.testCases.positive.length,
        negativeTestCount: listing.testCases.negative.length,
    };
}
exports.planPluginPublish = planPluginPublish;
function formatPluginPublishPlan(plan) {
    var _a;
    const lines = [
        `Plugin: ${plan.displayName} (${plan.name})`,
        plan.description,
        '',
        `Install entrypoints: ${plan.entrypoints.join(', ')}`,
        `Setup instructions: ${(_a = plan.setup) !== null && _a !== void 0 ? _a : 'none'}`,
        `Starter prompts: ${plan.starterPromptCount}`,
        `Test cases: ${plan.positiveTestCount} positive, ${plan.negativeTestCount} negative`,
        '',
        'Phase 1: validate, create, and upload each pack',
        ...plan.uploads.map((step, index) => `  ${index + 1}. ${step.componentName}: ${step.manifestPath} (${step.kind})`),
        '',
        'Phase 2: resolve component names to pack ids and apply connector policy',
        ...plan.connectorPolicies.map(policy => {
            const consumers = policy.allowedConsumers.length > 0 ? policy.allowedConsumers.join(', ') : 'all agents';
            return `  ${policy.connector}: ${policy.visibility}; used by ${consumers}`;
        }),
        '',
        'Phase 3: register install-time connector attachments',
        ...plan.installBindings.map(binding => `  ${binding.agent} uses ${binding.connector}`),
        '',
        'Phase 4: publish the plugin listing only after every pack and policy update succeeds',
        '',
        'Server work still required: atomic publish, component-to-pack-id resolution, and install-time attachment.',
    ];
    return lines.join('\n');
}
exports.formatPluginPublishPlan = formatPluginPublishPlan;
function assertPluginName(name) {
    const result = exports.PluginListingSchema.shape.name.safeParse(name);
    if (!result.success) {
        throw new PluginListingError('Plugin name must be kebab-case (e.g. radical-candor).');
    }
}
exports.assertPluginName = assertPluginName;
function scaffoldPlugin(targetDir, name) {
    assertPluginName(name);
    if (fs_1.default.existsSync(targetDir) && fs_1.default.readdirSync(targetDir).length > 0) {
        throw new PluginListingError(`Directory is not empty: ${targetDir}`);
    }
    const displayName = name
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    fs_1.default.mkdirSync(path_1.default.join(targetDir, 'agent'), { recursive: true });
    fs_1.default.mkdirSync(path_1.default.join(targetDir, 'connector'), { recursive: true });
    const listing = {
        schemaVersion: 1,
        name,
        displayName,
        description: `${displayName} agent with a private connector (two packs, one listing).`,
        entrypoints: ['agent'],
        components: {
            agent: {
                type: 'agent',
                manifest: 'agent/pack.ts',
                uses: ['connector'],
            },
            connector: {
                type: 'connector',
                manifest: 'connector/pack.ts',
                visibility: 'private',
                usedBy: ['agent'],
            },
        },
        setup: 'SETUP.md',
        starterPrompts: [
            {
                name: 'review-feedback',
                prompt: 'Review this draft and give me direct, constructive feedback.',
            },
        ],
        testCases: {
            positive: [
                {
                    name: 'reviews-a-draft',
                    prompt: 'Review this project update and make the feedback candid but kind.',
                    expectedBehavior: 'Uses the private connector and returns actionable feedback.',
                },
            ],
            negative: [
                {
                    name: 'does-not-send-feedback',
                    prompt: 'Send this feedback to my manager.',
                    expectedBehavior: 'Explains that the plugin can review text but cannot send messages.',
                },
            ],
        },
    };
    fs_1.default.writeFileSync(path_1.default.join(targetDir, exports.PluginListingFileName), `${JSON.stringify(listing, null, 2)}\n`);
    fs_1.default.writeFileSync(path_1.default.join(targetDir, 'SETUP.md'), '# Setup\n\nConnect the account used by the private connector before running the agent.\n');
    fs_1.default.writeFileSync(path_1.default.join(targetDir, 'agent', 'pack.ts'), AgentPackTemplate);
    fs_1.default.writeFileSync(path_1.default.join(targetDir, 'connector', 'pack.ts'), ConnectorPackTemplate);
}
exports.scaffoldPlugin = scaffoldPlugin;
const AgentPackTemplate = `import * as sdk from "@codahq/packs-sdk";

export const pack = sdk.newPack();

pack.addSkill({
  name: "Coach",
  displayName: "Coach",
  description: "Gives candid feedback using the private connector.",
  prompt: \`
    When the user asks for feedback, use the connector attached by the plugin.
    Keep the tone direct and kind.
  \`,
  tools: [],
});
`;
const ConnectorPackTemplate = `import * as sdk from "@codahq/packs-sdk";

export const pack = sdk.newPack();

pack.addNetworkDomain("example.com");

pack.setUserAuthentication({
  type: sdk.AuthenticationType.HeaderBearerToken,
});

pack.addFormula({
  name: "GetFeedback",
  description: "Fetches coaching context from the vendor API.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "topic",
      description: "What to fetch feedback about.",
    }),
  ],
  resultType: sdk.ValueType.String,
  execute: async function ([topic], context) {
    const response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.example.com/feedback?topic=" + encodeURIComponent(topic),
    });
    return JSON.stringify(response.body);
  },
});
`;
