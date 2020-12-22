import type { PackDefinition } from '../types';
import type { PackMetadata } from '../compiled_types';
import { ValueType } from '../schema';
export declare const FakeNpmProviderId = 9011;
export declare const FakeNpmPackId = 8003;
export declare const FakeNpmPackVersion = "5.2.3";
export declare const versionSchema: {
    type: ValueType.Object;
    identity: {
        packId: number;
        name: string;
    };
    id: "url";
    primary: "url";
    properties: {
        url: {
            type: ValueType.String;
        };
        version: {
            type: ValueType.String;
        };
        downloadCount: {
            type: ValueType.Number;
        };
    };
};
export declare const personSchema: {
    type: ValueType.Object;
    codaType: ValueType.Person;
    id: "email";
    primary: "name";
    properties: {
        email: {
            type: ValueType.String;
            required: true;
        };
        name: {
            type: ValueType.String;
            required: true;
        };
    };
};
export declare const packageSchema: {
    type: ValueType.Object;
    identity: {
        packId: number;
        name: string;
    };
    id: "url";
    primary: "url";
    featured: ("packageName" | "downloadCount")[];
    properties: {
        packageName: {
            type: ValueType.String;
        };
        url: {
            type: ValueType.String;
        };
        author: {
            type: ValueType.Object;
            codaType: ValueType.Person;
            id: "email";
            primary: "name";
            properties: {
                email: {
                    type: ValueType.String;
                    required: true;
                };
                name: {
                    type: ValueType.String;
                    required: true;
                };
            };
        };
        downloadCount: {
            type: ValueType.Number;
        };
        versions: {
            type: ValueType.Array;
            items: import("../schema").GenericObjectSchema;
        };
    };
};
export declare const FakeNpmDefinition: PackDefinition;
export declare const FakeNpmMetadata: PackMetadata;
