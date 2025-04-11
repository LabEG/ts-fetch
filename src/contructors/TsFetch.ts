/* eslint-disable class-methods-use-this */

import {Serializable} from "ts-serializable";
import {BackError} from "../models/errors/back.error.js";
import {NetError} from "../models/errors/net.error.js";
import {BodyInit} from "undici-types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PromiseResRej = (obj: any) => void;

export interface TsRequestInit<T> extends Omit<RequestInit, "body"> {

    /**
     * URL for request
     */
    url: string | URL | globalThis.Request;

    /**
     * Body for fetch
     */
    body?: BodyInit | object;

    /**
     * Response Type
     */
    returnType?: T;
}

export class TsFetch {

    // Cache for all GET and HEAD request
    protected readonly requestCache: Map<string, [PromiseResRej, PromiseResRej][]> =
        new Map<string, [PromiseResRej, PromiseResRej][]>();

    // Overloads
    public async send (options: TsRequestInit<void>): Promise<void>;
    public async send<T extends boolean>(options: TsRequestInit<T>): Promise<T>;
    public async send<T extends number>(options: TsRequestInit<T>): Promise<T>;
    public async send<T extends string>(options: TsRequestInit<T>): Promise<T>;
    public async send<T>(options: TsRequestInit<new () => T>): Promise<T>;
    public async send<T>(options: TsRequestInit<[new () => T]>): Promise<T[]>;

    // eslint-disable-next-line max-lines-per-function, max-statements, complexity
    public async send<T>(options: TsRequestInit<unknown>): Promise<T> {
        const {url, body, returnType, ...otherInits} = options;
        const input = url;

        /**
         * Setup cache
         */
        const isCacheableRequest: boolean = options.method === "GET" || options.method === "HEAD";
        const cacheKey = [
            options.method,
            input instanceof globalThis.Request ? input.url : input
        ].join(" ");

        if (isCacheableRequest) {
            if (this.requestCache.has(cacheKey)) {
                return new Promise((res: (val: T) => void, rej: () => void) => {
                    this.requestCache.get(cacheKey)?.push([res, rej]); // [res, rej] - its tuple
                });
            }
            this.requestCache.set(cacheKey, []);
        }

        /**
         * Prepare headers
         */

        let sendBody: BodyInit | undefined = void 0;
        const headers = this.setHeaders();
        if (
            body instanceof ArrayBuffer ||
            body instanceof Uint8Array ||
            body instanceof Blob ||
            body instanceof FormData ||
            // NodeJS.ArrayBufferView
            body instanceof URLSearchParams ||
            body === null ||
            typeof body === "string"
        ) {
            // Fetch add needed headers self
            sendBody = body;
        } else if (typeof body === "object") {
            headers.set("content-type", "application/json");
            sendBody = JSON.stringify(body);
        }
        if (options.headers) {
            const optHeaders = new Headers(options.headers);
            for (const entry of optHeaders.entries()) {
                headers.set(entry[0], entry[1]);
            }
        }

        /**
         * Process request
         */
        // eslint-disable-next-line no-useless-assignment
        let responseText: string = "";
        try {
            let response = await fetch(
                input,
                {
                    method: options.method,
                    body: sendBody,
                    headers,
                    ...otherInits
                }
            );
            response = await this.handleError(response);
            responseText = await response.text();
        } catch (fetchError: unknown) {
            if (isCacheableRequest && this.requestCache.has(cacheKey)) {
                this.requestCache.get(cacheKey)?.forEach((tuple: [PromiseResRej, PromiseResRej]) => {
                    try {
                        tuple[1](fetchError);
                    } catch (re: unknown) {
                        // eslint-disable-next-line no-console
                        console.error(re);
                    }
                });
                this.requestCache.delete(cacheKey);
            }
            throw fetchError;
        }

        /**
         * Parse data
         */
        let data: unknown = void 0;
        if (returnType === void 0) {
            data = void 0;
        } else if (
            Array.isArray(returnType) &&
            responseText.startsWith("[")
        ) {
            data = JSON.parse(responseText) as object;
            // Return models.map((model: object) => new returnType[0]().fromJSON(model));
        } else if (
            typeof returnType === "function" &&
            returnType.prototype instanceof Serializable &&
            responseText.startsWith("{")
        ) {
            const constructor = returnType as new () => Serializable;
            data = new constructor().fromJSON(JSON.parse(responseText) as object);
        } else if (typeof returnType === "object" && responseText.startsWith("{")) {
            data = JSON.parse(responseText) as object;
        } else if (typeof returnType === "string") {
            data = responseText;
        } else if (typeof returnType === "number") {
            data = Number(responseText);
        } else if (typeof returnType === "boolean") {
            data = Boolean(responseText);
        } else if (typeof returnType === "undefined") {
            data = void 0;
        } else {
            const error = new NetError(`Wrong returned type. Must by ${typeof returnType} but return ${typeof responseText}`);
            if (isCacheableRequest && this.requestCache.has(cacheKey)) {
                this.requestCache.get(cacheKey)?.forEach((tuple: [PromiseResRej, PromiseResRej]) => {
                    try {
                        tuple[1](error);
                    } catch (typeError: unknown) {
                        // eslint-disable-next-line no-console
                        console.error(typeError);
                    }
                });
                this.requestCache.delete(cacheKey);
            }
            throw error;
        }


        /**
         * Restore cache
         */
        if (isCacheableRequest && this.requestCache.has(cacheKey)) {
            this.requestCache.get(cacheKey)?.forEach((tuple: [PromiseResRej, PromiseResRej]) => {
                try {
                    tuple[0](data as T);
                } catch (promiseError: unknown) {
                    // eslint-disable-next-line no-console
                    console.error(promiseError);
                }
            });
            this.requestCache.delete(cacheKey);
        }

        return data as T;
    }

    // eslint-disable-next-line max-statements
    protected async handleError (response: Response): Promise<Response> {
        if (response.ok) {
            return response;
        }

        const body: string = await response.text();
        // eslint-disable-next-line no-useless-assignment
        let error: BackError | NetError | null = null;

        if (response.status === 401) {
            error = new NetError("Authorization exception", 401);
        } else if (body.startsWith("<")) { // Java xml response
            // eslint-disable-next-line prefer-named-capture-group
            const match: RegExpMatchArray | null = (/<b>description<\/b> <u>(.+?)<\/u>/gu).exec(body);
            error = new NetError(`${response.status.toString()} - ${((match?.[1] ?? response.statusText) || "Ошибка не указана")}`);
        } else if (body.startsWith("{")) { // Backend response
            error = this.parseBackendError(response, body);
        } else {
            error = new NetError(`${response.status.toString()} - ${response.statusText}`);
        }

        error.status = response.status;
        error.body = body;

        throw error;
    }

    protected setHeaders (): Headers {
        const headers = new Headers();
        return headers;
    }

    protected parseBackendError (response: Response, body: string): BackError {
        // Override method, check on message property
        const backError = new BackError(`${response.status.toString()} - ${response.statusText}`);
        backError.body = body;

        return backError;
    }

}
