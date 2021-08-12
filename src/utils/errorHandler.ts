/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {addNotification as notify} from "~"

export const isErrorLike = (obj: unknown): obj is {name: string; message: string} =>
    obj instanceof Error ||
    (typeof obj === "object" &&
        typeof (obj as {[key: string]: unknown}).name === "string" &&
        typeof (obj as {[key: string]: unknown}).message === "string")

export const createError = (obj: unknown): Error => {
    if (obj instanceof Error) {
        return obj
    } else if (isErrorLike(obj)) {
        const error = new Error(obj.message)

        error.name = obj.name

        return error
    }

    return new Error(JSON.stringify(obj))
}

export const handleError = (err: unknown): void => {
    console.error(err)

    if (err instanceof Error) {
        notify?.(err)
    } else {
        notify?.({
            title: "Error",
            icon: "report_problem",
            iconClassName: "text-danger",
            content: `ERROR: ${createError(err)}`,
        })
    }
}

export const catcherPromise = async <T>(func: () => Promise<T>): Promise<T | Error> => {
    try {
        return await func()
    } catch (err) {
        handleError(err)

        return createError(err)
    }
}

export const catcher = <T>(func: () => T): T | undefined => {
    try {
        return func()
    } catch (err) {
        handleError(err)

        return
    }
}

export default catcherPromise
