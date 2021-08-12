/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file I Hate dealing with time zones
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

/**
 * Get the current UTC Time
 */
export const getUtcTime = (): number => {
    const now = new Date()

    return Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds(),
    )
}

type Instantiable<T> = new (...args: unknown[]) => T

/**
 * Convert a utc date to local
 */
export const utcToLocal = <T extends Date>(date: T, constructor: Instantiable<T>): T => {
    const newDate = new constructor(date.getTime())

    newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset())

    return newDate
}

export default {
    getUtcTime,
    utcToLocal,
}
