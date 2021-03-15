import type { FetchMethodType } from './api_types';
import type { FetchRequest } from './api_types';
import type { FetchResponse } from './api_types';
import type { PackFormulaValue } from './api_types';
import type { ParamDefs } from './api_types';
import type { Schema } from './schema';
import type { SchemaType } from './schema';
declare type ParamMapper<T> = (val: T) => T;
export interface RequestHandlerTemplate {
    url: string;
    method: FetchMethodType;
    headers?: {
        [header: string]: string;
    };
    nameMapping?: {
        [functionParamName: string]: string;
    };
    transforms?: {
        [name: string]: ParamMapper<any>;
    };
    queryParams?: string[];
    bodyTemplate?: object;
    bodyParams?: string[];
}
export interface ResponseHandlerTemplate<T extends Schema> {
    schema?: T;
    projectKey?: string;
    onError?(error: Error): any;
}
export declare function generateRequestHandler<ParamDefsT extends ParamDefs>(request: RequestHandlerTemplate, parameters: ParamDefsT): (params: PackFormulaValue[]) => FetchRequest;
export declare function transformBody(body: any, schema: Schema): any;
export declare function generateObjectResponseHandler<T extends Schema>(response: ResponseHandlerTemplate<T>): (response: FetchResponse, runtimeSchema?: T) => SchemaType<T>;
export {};
