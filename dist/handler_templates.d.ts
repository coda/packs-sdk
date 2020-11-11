import { FetchRequest } from './api_types';
import { FetchResponse } from './api_types';
import { PackFormulaValue } from './api_types';
import { ParamDefs } from './api_types';
import { Schema } from './schema';
import { SchemaType } from './schema';
declare type ParamMapper<T> = (val: T) => T;
export interface RequestHandlerTemplate {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
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
    bodyTemplate?: Record<string, unknown>;
    bodyParams?: string[];
}
export interface ResponseHandlerTemplate<T extends Schema> {
    schema?: T;
    projectKey?: string;
    excludeExtraneous?: boolean;
    onError?(error: Error): any;
}
export declare function generateRequestHandler<ParamDefsT extends ParamDefs>(request: RequestHandlerTemplate, parameters: ParamDefsT): (params: PackFormulaValue[]) => FetchRequest;
export declare function transformBody(body: any, schema: Schema, excludeExtraneous?: boolean): any;
export declare function generateObjectResponseHandler<T extends Schema>(response: ResponseHandlerTemplate<T>): (response: FetchResponse, runtimeSchema?: T) => SchemaType<T>;
export {};
