import fs from 'fs';
import path from 'path';
import {z} from 'zod';

export const PluginListingFileName = 'plugin.json';

const ConnectorVisibility = z.enum(['private', 'public']);

const ComponentName = z.string().regex(/^[a-z][a-z0-9-]*$/, 'Component names must be kebab-case.');
const ComponentReferences = z
  .array(ComponentName)
  .refine(references => new Set(references).size === references.length, 'Component references must be unique.');
const RelativeManifestPath = z
  .string()
  .min(1)
  .refine(manifestPath => !path.isAbsolute(manifestPath), 'Manifest paths must be relative.')
  .refine(
    manifestPath => !path.normalize(manifestPath).split(path.sep).includes('..'),
    'Manifest paths cannot leave the plugin directory.',
  );

const AgentComponentSchema = z
  .object({
    type: z.literal('agent'),
    manifest: RelativeManifestPath,
    uses: ComponentReferences.default([]),
  })
  .strict();

const ConnectorComponentSchema = z
  .object({
    type: z.literal('connector'),
    manifest: RelativeManifestPath,
    visibility: ConnectorVisibility,
    usedBy: ComponentReferences.refine(references => references.length > 0, 'usedBy cannot be empty.').optional(),
  })
  .strict();

const StarterPromptSchema = z
  .object({
    name: ComponentName,
    prompt: z.string().min(1),
  })
  .strict();

const TestCaseSchema = z
  .object({
    name: ComponentName,
    prompt: z.string().min(1),
    expectedBehavior: z.string().min(1),
  })
  .strict();

export const PluginListingSchema = z
  .object({
    schemaVersion: z.literal(1),
    name: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Plugin name must be kebab-case (e.g. radical-candor).'),
    displayName: z.string().min(1),
    description: z.string().min(1),
    entrypoints: ComponentReferences.refine(references => references.length > 0, 'A plugin needs an entrypoint.'),
    components: z.record(ComponentName, z.discriminatedUnion('type', [AgentComponentSchema, ConnectorComponentSchema])),
    setup: RelativeManifestPath.optional(),
    starterPrompts: z.array(StarterPromptSchema).default([]),
    testCases: z
      .object({
        positive: z.array(TestCaseSchema).default([]),
        negative: z.array(TestCaseSchema).default([]),
      })
      .strict()
      .default({positive: [], negative: []}),
  })
  .strict();

export type PluginListing = z.infer<typeof PluginListingSchema>;

export class PluginListingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PluginListingError';
  }
}

export function loadPluginListing(pluginJsonPath: string): PluginListing {
  if (!fs.existsSync(pluginJsonPath)) {
    throw new PluginListingError(`No ${PluginListingFileName} at ${pluginJsonPath}.`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new PluginListingError(`Invalid JSON in ${pluginJsonPath}: ${detail}`);
  }
  const result = PluginListingSchema.safeParse(parsed);
  if (!result.success) {
    throw new PluginListingError(result.error.issues.map(issue => issue.message).join('; '));
  }
  return result.data;
}

export function validatePluginListing(listing: PluginListing, pluginRoot: string): void {
  const entries = Object.entries(listing.components);
  if (entries.length === 0) {
    throw new PluginListingError('A plugin needs at least one component.');
  }

  for (const entrypoint of listing.entrypoints) {
    if (!listing.components[entrypoint]) {
      throw new PluginListingError(`Entrypoint does not exist: ${entrypoint}`);
    }
  }

  assertUniqueNames(
    listing.starterPrompts.map(prompt => prompt.name),
    'starter prompt',
  );
  assertUniqueNames(
    [...listing.testCases.positive, ...listing.testCases.negative].map(testCase => testCase.name),
    'test case',
  );

  const pluginRootRealPath = fs.realpathSync(pluginRoot);
  if (listing.setup) {
    validatePluginFile('Setup instructions', listing.setup, pluginRoot, pluginRootRealPath);
  }

  const seenManifests = new Set<string>();
  for (const [componentName, component] of entries) {
    const manifestRealPath = validatePluginFile(
      `Manifest for ${componentName}`,
      component.manifest,
      pluginRoot,
      pluginRootRealPath,
    );
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
        if (dependencyComponent.visibility === 'private' && !dependencyComponent.usedBy?.includes(componentName)) {
          throw new PluginListingError(
            `Agent ${componentName} uses private connector ${dependency}, but the connector does not allow it.`,
          );
        }
      }
      continue;
    }
    if (component.visibility === 'private') {
      const consumers = component.usedBy ?? [];
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
    } else if (component.usedBy) {
      throw new PluginListingError(`Public connector ${componentName} cannot set usedBy.`);
    }
  }
}

function assertUniqueNames(names: string[], label: string): void {
  const seen = new Set<string>();
  for (const name of names) {
    if (seen.has(name)) {
      throw new PluginListingError(`Duplicate ${label} name: ${name}`);
    }
    seen.add(name);
  }
}

function validatePluginFile(
  label: string,
  relativePath: string,
  pluginRoot: string,
  pluginRootRealPath: string,
): string {
  const absolutePath = path.resolve(pluginRoot, relativePath);
  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
    throw new PluginListingError(`${label} is missing: ${relativePath}`);
  }
  const realPath = fs.realpathSync(absolutePath);
  if (!isWithinDirectory(realPath, pluginRootRealPath)) {
    throw new PluginListingError(`${label} leaves the plugin directory.`);
  }
  return realPath;
}

function isWithinDirectory(candidatePath: string, directoryPath: string): boolean {
  const relativePath = path.relative(directoryPath, candidatePath);
  return relativePath !== '..' && !relativePath.startsWith(`..${path.sep}`) && !path.isAbsolute(relativePath);
}

export interface PluginUploadStep {
  componentName: string;
  kind: 'agent' | 'connector';
  manifestPath: string;
}

export interface PluginConnectorPolicy {
  connector: string;
  visibility: 'private' | 'public';
  allowedConsumers: string[];
}

export interface PluginInstallBinding {
  agent: string;
  connector: string;
}

export interface PluginPublishPlan {
  name: string;
  displayName: string;
  description: string;
  entrypoints: string[];
  uploads: PluginUploadStep[];
  connectorPolicies: PluginConnectorPolicy[];
  installBindings: PluginInstallBinding[];
  setup?: string;
  starterPromptCount: number;
  positiveTestCount: number;
  negativeTestCount: number;
}

export function planPluginPublish(pluginJsonPath: string): PluginPublishPlan {
  const pluginRoot = path.dirname(pluginJsonPath);
  const listing = loadPluginListing(pluginJsonPath);
  validatePluginListing(listing, pluginRoot);

  const uploads: PluginUploadStep[] = [];
  const connectorPolicies: PluginConnectorPolicy[] = [];
  const installBindings: PluginInstallBinding[] = [];
  for (const [componentName, component] of Object.entries(listing.components)) {
    uploads.push({
      componentName,
      kind: component.type,
      manifestPath: component.manifest,
    });
    if (component.type === 'agent') {
      installBindings.push(
        ...component.uses.map(connector => ({
          agent: componentName,
          connector,
        })),
      );
    } else {
      connectorPolicies.push({
        connector: componentName,
        visibility: component.visibility,
        allowedConsumers: component.usedBy ?? [],
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

export function formatPluginPublishPlan(plan: PluginPublishPlan): string {
  const lines = [
    `Plugin: ${plan.displayName} (${plan.name})`,
    plan.description,
    '',
    `Install entrypoints: ${plan.entrypoints.join(', ')}`,
    `Setup instructions: ${plan.setup ?? 'none'}`,
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

export function assertPluginName(name: string): void {
  const result = PluginListingSchema.shape.name.safeParse(name);
  if (!result.success) {
    throw new PluginListingError('Plugin name must be kebab-case (e.g. radical-candor).');
  }
}

export function scaffoldPlugin(targetDir: string, name: string): void {
  assertPluginName(name);
  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    throw new PluginListingError(`Directory is not empty: ${targetDir}`);
  }

  const displayName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  fs.mkdirSync(path.join(targetDir, 'agent'), {recursive: true});
  fs.mkdirSync(path.join(targetDir, 'connector'), {recursive: true});

  const listing: PluginListing = {
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
  fs.writeFileSync(path.join(targetDir, PluginListingFileName), `${JSON.stringify(listing, null, 2)}\n`);
  fs.writeFileSync(
    path.join(targetDir, 'SETUP.md'),
    '# Setup\n\nConnect the account used by the private connector before running the agent.\n',
  );
  fs.writeFileSync(path.join(targetDir, 'agent', 'pack.ts'), AgentPackTemplate);
  fs.writeFileSync(path.join(targetDir, 'connector', 'pack.ts'), ConnectorPackTemplate);
}

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
