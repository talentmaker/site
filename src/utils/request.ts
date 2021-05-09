/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {inlineTryPromise} from "./try"

/* eslint-disable prefer-arrow/prefer-arrow-functions */

type Methods = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE"
type Conversions = "arrayBuffer" | "blob" | "formData" | "json" | "text"

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface ConversionTypes extends Omit<Body, "json"> {
    json: {[key: string]: unknown}
}

class HTTPError extends Error {
    public readonly name = "HTTPError"

    public constructor(public readonly status: number, message: string) {
        super(`${status} - ${message}`)
    }
}

/**
 * Wrapper for the fetch API that is hopefully a bit more intuitive
 *
 * @param url - Url of request
 * @param method - Method of request
 * @param conversion - What to convert the response to
 * @param contentType - Content type
 * @param init - Other request params
 * @returns The converted response
 */
export async function request<T extends Conversions>(
    url: string,
    method: Methods,
    conversion: T,
    body?: {[key: string]: unknown},
    contentType?: string,
    init?: RequestInit,
): Promise<ConversionTypes[T]>

/**
 * Wrapper for the fetch API that is hopefully a bit more intuitive
 *
 * @param url - Url of request
 * @param method - Method of request
 * @param conversion - What to convert the response to
 * @param contentType - Content type
 * @param init - Other request params
 * @returns The converted response
 */
export async function request(
    url: string,
    method: Methods,
    conversion?: undefined,
    body?: {[key: string]: unknown},
    contentType?: string,
    init?: RequestInit,
): Promise<Response>

/**
 * Wrapper for the fetch API that is hopefully a bit more intuitive
 *
 * @param url - Url of request
 * @param method - Method of request
 * @param conversion - What to convert the response to
 * @param contentType - Content type
 * @param param4 - Other request params which haven't been specified
 */
export async function request<T extends Conversions>(
    url: string,
    method: Methods,
    conversion?: T,
    body?: {[key: string]: unknown},
    contentType = "application/json",
    {headers, ...init}: RequestInit = {},
): Promise<Response | ConversionTypes[T]> {
    const response = await fetch(url, {
        ...init,
        method,
        headers: {...headers, "Content-Type": contentType},
        body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
        const msg = await inlineTryPromise<{[key: string]: unknown}>(() => response.json(), false)

        if (msg) {
            throw new HTTPError(
                response.status,
                typeof msg.message === "string" ? msg.message : JSON.stringify(msg),
            )
        }

        throw new HTTPError(response.status, response.statusText)
    }

    if (conversion) {
        return await response[conversion]()
    }

    return response
}

export default request

/* eslint-enable prefer-arrow/prefer-arrow-functions */
