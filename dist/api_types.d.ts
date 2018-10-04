import { $Omit } from './type_utils';
import { $Values } from './type_utils';
export declare enum Type {
    string = 0,
    number = 1,
    object = 2,
    boolean = 3,
    date = 4
}
export interface ArrayType<T extends Type> {
    type: 'array';
    items: T;
}
export declare function isArrayType(obj: any): obj is ArrayType<any>;
declare type UnionType = ArrayType<Type> | Type;
export declare const stringArray: ArrayType<Type.string>;
export declare const numberArray: ArrayType<Type.number>;
export declare const booleanArray: ArrayType<Type.boolean>;
export declare const dateArray: ArrayType<Type.date>;
declare type ConcreteArrayTypes = string[] | number[] | boolean[] | Date[];
interface TypeMap {
    [Type.number]: number;
    [Type.string]: string;
    [Type.object]: object;
    [Type.boolean]: boolean;
    [Type.date]: Date;
}
export declare type PackFormulaValue = $Values<$Omit<TypeMap, Type.object>> | ConcreteArrayTypes;
export declare type PackFormulaResult = $Values<TypeMap> | ConcreteArrayTypes;
export declare type TypeOf<T extends PackFormulaResult> = T extends number ? Type.number : (T extends string ? Type.string : (T extends boolean ? Type.boolean : (T extends Date ? Type.date : (T extends object ? Type.object : never))));
export interface ParamDef<T extends UnionType> {
    name: string;
    type: T;
    description: string;
    optional?: boolean;
    hidden?: boolean;
}
export declare type ParamArgs<T extends UnionType> = $Omit<ParamDef<T>, 'description' | 'name' | 'type'>;
export declare type ParamDefs = [] | [ParamDef<any>] | [ParamDef<any>, ParamDef<any>] | [ParamDef<any>, ParamDef<any>, ParamDef<any>] | [ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>] | [ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>] | [ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>] | [ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>, ParamDef<any>] | never;
export declare type ParamsList = Array<ParamDef<UnionType>>;
declare type TypeOfMap<T extends UnionType> = T extends Type ? TypeMap[T] : (T extends ArrayType<infer V> ? Array<TypeMap[V]> : never);
export declare type ParamValues<ParamDefsT> = ParamDefsT extends [] ? [] : ParamDefsT extends [ParamDef<infer A1>] ? [TypeOfMap<A1>] : (ParamDefsT extends [ParamDef<infer A2>, ParamDef<infer B2>] ? [TypeOfMap<A2>, TypeOfMap<B2>] : (ParamDefsT extends [ParamDef<infer A3>, ParamDef<infer B3>, ParamDef<infer C3>] ? [TypeOfMap<A3>, TypeOfMap<B3>, TypeOfMap<C3>] : (ParamDefsT extends [ParamDef<infer A4>, ParamDef<infer B4>, ParamDef<infer C4>, ParamDef<infer D4>] ? [TypeOfMap<A4>, TypeOfMap<B4>, TypeOfMap<C4>, TypeOfMap<D4>] : (ParamDefsT extends [ParamDef<infer A5>, ParamDef<infer B5>, ParamDef<infer C5>, ParamDef<infer D5>, ParamDef<infer E5>] ? [TypeOfMap<A5>, TypeOfMap<B5>, TypeOfMap<C5>, TypeOfMap<D5>, TypeOfMap<E5>] : (ParamDefsT extends [ParamDef<infer A6>, ParamDef<infer B6>, ParamDef<infer C6>, ParamDef<infer D6>, ParamDef<infer E6>, ParamDef<infer F6>] ? [TypeOfMap<A6>, TypeOfMap<B6>, TypeOfMap<C6>, TypeOfMap<D6>, TypeOfMap<E6>, TypeOfMap<F6>] : (ParamDefsT extends [ParamDef<infer A7>, ParamDef<infer B7>, ParamDef<infer C7>, ParamDef<infer D7>, ParamDef<infer E7>, ParamDef<infer F7>, ParamDef<infer G7>] ? [TypeOfMap<A7>, TypeOfMap<B7>, TypeOfMap<C7>, TypeOfMap<D7>, TypeOfMap<E7>, TypeOfMap<F7>, TypeOfMap<G7>] : never[]))))));
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
export {};
