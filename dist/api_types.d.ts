export declare enum Type {
    string = 0,
    number = 1,
    object = 2,
    boolean = 3,
    date = 4
}
export interface TypeMap {
    [Type.number]: number;
    [Type.string]: string;
    [Type.object]: object;
    [Type.boolean]: boolean;
    [Type.date]: Date;
}
export declare type PackFormulaValue = $Values<$Omit<TypeMap, Type.object>>;
export declare type PackFormulaResult = $Values<TypeMap>;
export declare type TypeOf<T extends PackFormulaResult> = T extends number ? Type.number : (T extends string ? Type.string : (T extends boolean ? Type.boolean : (T extends Date ? Type.date : (T extends object ? Type.object : never))));
export interface ParamDef<T extends Type> {
    name: string;
    type: T;
    description: string;
    optional?: boolean;
    hidden?: boolean;
}
export declare type ParamArgs<T extends Type> = $Omit<ParamDef<T>, 'description' | 'name' | 'type'>;
export declare type ParamDefs = [] | [ParamDef<any>] | [ParamDef<any>, ParamDef<any>] | [ParamDef<any>, ParamDef<any>, ParamDef<any>] | [ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>] | [ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>] | [ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>] | [ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>] | never;
export declare type ParamsList = Array<ParamDef<any>>;
export declare type ParamValues<ParamDefsT> = ParamDefsT extends [] ? [] : ParamDefsT extends [ParamDef<infer A1>] ? [TypeMap[A1]] : (ParamDefsT extends [ParamDef<infer A2>, ParamDef<infer B2>] ? [TypeMap[A2], TypeMap[B2]] : (ParamDefsT extends [ParamDef<infer A3>, ParamDef<infer B3>, ParamDef<infer C3>] ? [TypeMap[A3], TypeMap[B3], TypeMap[C3]] : (ParamDefsT extends [ParamDef<infer A4>, ParamDef<infer B4>, ParamDef<infer C4>, ParamDef<infer D4>] ? [TypeMap[A4], TypeMap[B4], TypeMap[C4], TypeMap[D4]] : (ParamDefsT extends [ParamDef<infer A5>, ParamDef<infer B5>, ParamDef<infer C5>, ParamDef<infer D5>, ParamDef<infer E5>] ? [TypeMap[A5], TypeMap[B5], TypeMap[C5], TypeMap[D5], TypeMap[E5]] : (ParamDefsT extends [ParamDef<infer A6>, ParamDef<infer B6>, ParamDef<infer C6>, ParamDef<infer D6>, ParamDef<infer E6>, ParamDef<infer F6>] ? [TypeMap[A6], TypeMap[B6], TypeMap[C6], TypeMap[D6], TypeMap[E6], TypeMap[F6]] : (ParamDefsT extends [ParamDef<infer A7>, ParamDef<infer B7>, ParamDef<infer C7>, ParamDef<infer D7>, ParamDef<infer E7>, ParamDef<infer F7>, ParamDef<infer G7>] ? [TypeMap[A7], TypeMap[B7], TypeMap[C7], TypeMap[D7], TypeMap[E7], TypeMap[F7], TypeMap[G7]] : never[]))))));
export interface CommonPackFormulaDef<T extends ParamDefs> {
    readonly name: string;
    readonly description: string;
    readonly examples: Array<{
        params: PackFormulaValue[];
        result: PackFormulaResult;
    }>;
    readonly parameters: T;
    readonly varargParameters?: ParamDefs;
    readonly network?: Network;
    /**
     * How long formulas running with the same values should cache their results for. By default, 1 second.
     */
    readonly cacheTtlSecs?: number;
    readonly isExperimental?: boolean;
}
export interface Network {
    readonly hasSideEffect: boolean;
    readonly hasConnection?: boolean;
    readonly requiresConnection?: boolean;
}
export interface FetchRequest {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    body?: string;
    headers?: {
        [header: string]: string;
    };
}
export interface FetchResponse<T extends any = any> {
    status: number;
    body?: T;
    headers: {
        [header: string]: string | string[] | undefined;
    };
}
export interface Fetcher {
    fetch<T = any>(request: FetchRequest): Promise<FetchResponse<T>>;
}
export interface ExecutionContext {
    readonly fetcher?: Fetcher;
}
