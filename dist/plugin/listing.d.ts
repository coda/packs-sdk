import { z } from 'zod';
export declare const PluginListingFileName = "plugin.json";
export declare const PluginListingSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    name: z.ZodString;
    displayName: z.ZodString;
    description: z.ZodString;
    entrypoints: z.ZodArray<z.ZodString>;
    components: z.ZodRecord<z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"agent">;
        manifest: z.ZodString;
        uses: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"connector">;
        manifest: z.ZodString;
        visibility: z.ZodEnum<{
            public: "public";
            private: "private";
        }>;
        usedBy: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>], "type">>;
    setup: z.ZodOptional<z.ZodString>;
    starterPrompts: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        prompt: z.ZodString;
    }, z.core.$strict>>>;
    testCases: z.ZodDefault<z.ZodObject<{
        positive: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            prompt: z.ZodString;
            expectedBehavior: z.ZodString;
        }, z.core.$strict>>>;
        negative: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            prompt: z.ZodString;
            expectedBehavior: z.ZodString;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type PluginListing = z.infer<typeof PluginListingSchema>;
export declare class PluginListingError extends Error {
    constructor(message: string);
}
export declare function loadPluginListing(pluginJsonPath: string): PluginListing;
export declare function validatePluginListing(listing: PluginListing, pluginRoot: string): void;
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
export declare function planPluginPublish(pluginJsonPath: string): PluginPublishPlan;
export declare function formatPluginPublishPlan(plan: PluginPublishPlan): string;
export declare function assertPluginName(name: string): void;
export declare function scaffoldPlugin(targetDir: string, name: string): void;
