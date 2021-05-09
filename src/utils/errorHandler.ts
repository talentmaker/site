/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import notify from "./notify"

export const handleError = (err: unknown): void => {
    console.error(err)

    if (err instanceof Error) {
        notify(err)
    } else {
        notify({
            title: "Error",
            icon: "report_problem",
            iconClassName: "text-danger",
            content: `ERROR: ${
                err instanceof Object &&
                typeof (err as {[key: string]: string}).message === "string"
                    ? (err as {[key: string]: string}).message
                    : JSON.stringify(err)
            }`,
        })
    }
}

export const catcherPromise = async <T>(func: () => Promise<T>): Promise<T | Error> => {
    try {
        return await func()
    } catch (err) {
        handleError(err)

        return err instanceof Error ? err : new Error(JSON.stringify(err))
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
