import type { ObjectSchemaDefinition } from '../schema';
import type { ParamDef } from '../api_types';
import type { PostSetupMetadata } from '../compiled_types';
import type { SetEndpoint } from '../types';
import type { SetEndpointDef } from '../types';
import type { SuggestedValueType } from '../api_types';
import type { UnionType } from '../api_types';
export declare function objectSchemaHelper<T extends ObjectSchemaDefinition<string, string>>(schema: T): ObjectSchemaHelper<T>;
declare class ObjectSchemaHelper<T extends ObjectSchemaDefinition<string, string>> {
    private readonly _schema;
    constructor(schema: T);
    get id(): string | undefined;
    get primary(): string | undefined;
    get featured(): string[] | undefined;
    get identity(): import("../schema").IdentityDefinition | undefined;
    get options(): import("../schema").PropertySchemaOptions<{}> | undefined;
    get properties(): import("../schema").ObjectSchemaProperties<string>;
    get type(): import("../schema").ValueType.Object;
    get attribution(): import("../schema").AttributionNode[] | undefined;
    get codaType(): import("../schema").ValueHintType.Person | import("../schema").ValueHintType.Reference | import("../schema").ValueHintType.SelectList | undefined;
}
export declare function paramDefHelper<S extends UnionType, T extends ParamDef<S>>(def: T): ParamDefHelper<S, T>;
declare class ParamDefHelper<S extends UnionType, T extends ParamDef<S>> {
    private readonly _def;
    constructor(def: T);
    get defaultValue(): SuggestedValueType<S> | undefined;
}
export declare function setEndpointHelper(step: SetEndpoint): SetEndpointHelper;
declare class SetEndpointHelper {
    private readonly _step;
    constructor(step: SetEndpoint);
    get getOptions(): import("..").MetadataFormula;
}
export declare function setEndpointDefHelper(step: SetEndpointDef): SetEndpointDefHelper;
declare class SetEndpointDefHelper {
    private readonly _step;
    constructor(step: SetEndpointDef);
    get getOptions(): import("..").MetadataFormula | import("..").MetadataFunction;
}
export declare function postSetupMetadataHelper(metadata: PostSetupMetadata): PostSetupMetadataHelper;
declare class PostSetupMetadataHelper {
    private readonly _metadata;
    constructor(metadata: PostSetupMetadata);
    get getOptions(): import("../api").MetadataFormulaMetadata;
}
export {};
