import type { ObjectSchemaDefinition } from '../schema';
export declare function objectSchemaHelper<T extends ObjectSchemaDefinition<string, string>>(schema: T): ObjectSchemaHelper<T>;
export declare class ObjectSchemaHelper<T extends ObjectSchemaDefinition<string, string>> {
    private readonly _schema;
    constructor(schema: T);
    get id(): string | undefined;
    get primary(): string | undefined;
    get featured(): string[] | undefined;
    get identity(): import("../schema").IdentityDefinition | undefined;
    get properties(): import("../schema").ObjectSchemaProperties<string>;
    get type(): import("../schema").ValueType.Object;
}
