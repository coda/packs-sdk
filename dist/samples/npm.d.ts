import { PackDefinition } from '../types';
import { PackMetadata } from '../compiled_types';
import { ValueType } from '../schema';
export declare const FakeNpmProviderId = 9011;
export declare const FakeNpmPackId = 8003;
export declare const FakeNpmPackVersion = "5.2.3";
export declare const versionSchema: {
    type: ValueType.Object;
    identity: {
        packId: 8003;
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
        };
        name: {
            type: ValueType.String;
        };
    };
};
export declare const packageSchema: {
    type: ValueType.Object;
    identity: {
        packId: 8003;
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
                };
                name: {
                    type: ValueType.String;
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
