/**
 * Talentmaker website
 *
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 * @file I hate dealing with time zones
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

type Instantiable<T> = {new(...args: unknown[]): T}

/**
 * Convert a utc date to local
 */
export const utcToLocal = <T extends Date>(
    date: T,
    Constructor: Instantiable<T>,
): T => {
    const newDate = new Constructor(date.getTime())

    newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset())

    return newDate
}

export default {
    getUtcTime,
    utcToLocal,
}
