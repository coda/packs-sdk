import type { FetchMethodType } from './api_types';
import type { FetchRequest } from './api_types';
import type { FetchResponse } from './api_types';
import type { PackFormulaValue } from './api_types';
import type { ParamDefs } from './api_types';
import type { Schema } from './schema';
import type { SchemaType } from './schema';
/**
 * Configuration for how to construct an HTTP request for a code-free formula definition
 * created using {@link makeTranslateObjectFormula}.
 *
 * @example
 * ```
 * coda.makeTranslateObjectFormula({
 *   name: "FetchWidget",
 *   description: "Fetches a widget.",
 *   parameters: [
 *     coda.makeParameter({type: coda.ParameterType.String, name: "id"}),
 *     coda.makeParameter({type: coda.ParameterType.String, name: "outputFormat"}),
 *   ],
 *   request: {
 *     method: "GET",
 *     url: "https://example.com/api/widgets/{id}",
 *     nameMapping: {outputFormat: "format"},
 *     transforms: {
 *       format: function(value) {
 *         return value.toLowerCase();
 *       },
 *     },
 *     queryParams: ["format"],
 *   },
 * });
 * ```
 *
 * If the user calls this formula as `FetchWidget("abc123", "JSON")`, this will make a `GET` request to
 * `https://example.com/api/widgets/abc123?format=json`.
 */
export interface RequestHandlerTemplate {
    /**
     * The URL to fetch.
     *
     * The path of the URL can include strong formatting directives that can be replaced with
     * formula parameters, e.g. "https://example.com/api/\{name\}".
     */
    url: string;
    /**
     * The HTTP method (verb) to use, e.g. "GET".
     *
     * If making a POST request or any request that uses a body payload, the body is
     * assumed to be JSON.
     */
    method: FetchMethodType;
    /** Any HTTP headers to include in the request. */
    headers?: {
        [header: string]: string;
    };
    /**
     * An optional mapping from the name of a formula parameter to the name of a URL parameter
     * or template substitution variable in the body or URL path.
     *
     * Fetcher requests are constructed by inserting the user's parameter values into the URL
     * or body. You may use the formula parameter names to in your insertion templates or
     * as URL parameter names, but you may also use this mapping to rename the formula
     * parameters, if you wish to refer to them differently in your implementation
     * than how you present them to users.
     */
    nameMapping?: {
        [functionParamName: string]: string;
    };
    /**
     * Optional transformations to apply to formula parameters. By default formula parameters
     * are passed through as-is to wherever you indicate in the fetcher request. However, if
     * you wish to tweak their values before constructing the request, you can apply transformations here.
     * The key is the name of the field, which is either the name of the formula parameter, or
     * the mapped name for that parameter if you specified a {@link nameMapping}.
     * The value is a JavaScript function that takes a user-provided parameter value and returns the value
     * that should be used in the request.
     */
    transforms?: {
        [name: string]: (val: any) => any;
    };
    /**
     * The names of parameters that should be included in the request URL.
     *
     * That is, if some of the formula parameters should go into the URL and others should go into the body,
     * specify the subset of parameters here that should go into the URL. If all of the formula parameters
     * should become URL parameters, list all of the parameter names here.
     *
     * These are the mapped names if you are using {@link nameMapping}.
     */
    queryParams?: string[];
    /**
     * A base JavaScript object to be used as the body payload. Any parameters named in {@link bodyParams}
     * will be merged into this object, and the resulting object will be stringified and sent as the body.
     */
    bodyTemplate?: object;
    /**
     * The names of parameters that should be included in the request body, if applicable.
     *
     * That is, if some of the formula parameters should go into the URL and others should go into the body,
     * specify the subset of parameters here that should go into the body. If all of the formula parameters
     * should go into the body, list all of the parameter names here.
     *
     * These are the mapped names if you are using {@link nameMapping}.
     */
    bodyParams?: string[];
}
/**
 * Configuration for how to handle the response for a code-free formula definition
 * created using {@link makeTranslateObjectFormula}.
 */
export interface ResponseHandlerTemplate<T extends Schema> {
    /** The schema of the objects being returned. */
    schema?: T;
    /**
     * The key in the response body that indicates the objects of interest.
     *
     * Sometimes the response body is itself an array of objects, allowing you
     * to return the body as-is, but more commonly, the response body is
     * an object where one of its properties is the array of objects of interest,
     * with other properties containing metadata about the response.
     *
     * This allows you to specify a response property name to "project" out
     * the relevant part of the response body.
     *
     * For example, suppose the response body looks like:
     * ```
     * {
     *   items: [{name: "Alice"}, {name: "Bob"}],
     *   nextPageUrl: "/users?page=2",
     * }
     * ```
     *
     * You would set `projectKey: "items"` and the generated formula implementation
     * will return `response.body.items`.
     */
    projectKey?: string;
    /**
     * If specified, will catch HTTP errors and call this function with the error,
     * instead of letting them throw and the formula failing.
     */
    onError?(error: Error): any;
}
export declare function generateRequestHandler<ParamDefsT extends ParamDefs>(request: RequestHandlerTemplate, parameters: ParamDefsT): (params: PackFormulaValue[]) => FetchRequest;
export declare function transformBody(body: any, schema: Schema | undefined): any;
export declare function untransformBody(body: any, schema: Schema | undefined): any;
/**
 * Reverses the transformation of schema object keys to the values expected by the pack.
 * Useful when passing in a list of keys from Coda -> Pack, such as when sending the aggregated
 * sync table update payload.
 */
export declare function untransformKeys(keys: string[], schema: Schema | undefined): string[];
export declare function generateObjectResponseHandler<T extends Schema>(response: ResponseHandlerTemplate<T>): (response: FetchResponse, runtimeSchema?: T) => SchemaType<T>;
