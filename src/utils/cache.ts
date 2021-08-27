/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file utility Functions for cacheing info in localstorage
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import lzString from "lz-string"

/**
 * An entry into localstorage
 */
type CacheEntry = {
    lastUsed: number
    data: string
}

/**
 * Cache configuration
 */
enum Config {
    /**
     * The max string length for a single cache item; saves space in the cache
     */
    MaxLen = 512,

    /**
     * The max array length for a single cache item; saves space
     */
    MaxArrayLen = 16,

    /**
     * Amount of cache to clear if full
     */
    AmountToClear = 1 / 8,
}

/**
 * Typegaurd to make sure obj is a cache entry
 */
const isCacheEntry = (obj: unknown): obj is CacheEntry =>
    typeof obj === "object" &&
    typeof (obj as {[key: string]: unknown}).lastUsed === "number" &&
    typeof (obj as {[key: string]: unknown}).data === "string"
/**
 * Gets all localstorage cache entries, and removes the oldest ones Also removed problematic cache
 * entries that cause errors
 */
const cleanCache = async (): Promise<void> =>
    await Promise.resolve().then(() => {
        const entries: [lastUsed: number, key: string][] = []

        for (const key of Object.keys(localStorage)) {
            try {
                const item = localStorage.getItem(key)

                if (item === null) {
                    // eslint-disable-next-line
                    continue
                }

                const parsedItem: unknown = JSON.parse(item)

                if (isCacheEntry(parsedItem)) {
                    entries.push([parsedItem.lastUsed, key])
                } else {
                    // eslint-disable-next-line
                    throw undefined
                }
            } catch {
                if (/^talentmakerCache.*/u.test(key)) {
                    localStorage.removeItem(key) // Remove error-causing keys
                }
            }
        }

        const sortedEntries = entries
            .sort((first, second) => second[0] - first[0]) // Sort from oldest to newest
            .slice((entries.length - entries.length) * Config.AmountToClear)

        for (const [, key] of sortedEntries) {
            localStorage.removeItem(key) // Remove storage items
        }
    })
/**
 * Truncates long strings as they take a lot of cache space
 */
const formatData = (data: unknown): unknown => {
    if (typeof data === "string" && data.length > Config.MaxLen) {
        // Truncate the long strings

        return `${data.slice(0, Config.MaxLen)} . . .\n\nData was truncated for storage purposes`
    } else if (data instanceof Array) {
        // Truncate long arrays and truncate array contents
        const newData: unknown[] = []

        for (const entry of data.slice(0, Config.MaxArrayLen)) {
            newData.push(formatData(entry)) // Call recursively
        }

        return newData
    } else if (typeof data === "object" && data !== null && !(data instanceof Date)) {
        // Truncate object contents
        const newData: {[key: string]: unknown} = {}

        for (const [key, value] of Object.entries(data)) {
            newData[key] = formatData(value) // Call recursively
        }

        return newData
    }

    return data
}
/**
 * If localstorage is enabled
 */
const hasLocalStorage = ((): boolean => {
    if (localStorage === undefined) {
        return false
    }

    try {
        localStorage.setItem("LSTest", "TEST")

        return localStorage.getItem("LSTest") === "TEST"
    } catch {
        return false
    }
})()

/**
 * Writes to localstorage with key
 *
 * @param key - Key to write data
 * @param data - Data to write
 */
export const writeCache = async (key: string, data: unknown): Promise<void> => {
    if (!hasLocalStorage) {
        return
    }

    return await Promise.resolve().then(() => {
        try {
            localStorage.setItem(
                key,
                JSON.stringify({
                    lastUsed: Date.now(),
                    data: lzString.compressToUTF16(JSON.stringify(formatData(data))),
                }),
            )
        } catch {
            cleanCache()
        }
    })
}

/**
 * Reads from localstorage and tries to parse the data
 *
 * @param key - Key for data
 */
export const readCache = async (key: string): Promise<unknown> => {
    if (!hasLocalStorage) {
        return
    }

    return await Promise.resolve().then(() => {
        const cacheEntry = localStorage.getItem(key)

        if (cacheEntry === null) {
            return null
        }

        try {
            const parsedCacheEntry: unknown = JSON.parse(cacheEntry)

            if (!isCacheEntry(parsedCacheEntry)) {
                return null
            }

            const decompressedData = lzString.decompressFromUTF16(parsedCacheEntry.data)

            if (decompressedData) {
                const parsedData: unknown = JSON.parse(decompressedData)

                return parsedData
            }

            return null
        } catch {
            return null
        }
    })
}

export default {
    read: readCache,
    write: writeCache,
}
