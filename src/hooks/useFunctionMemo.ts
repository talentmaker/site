/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import React from "react"
import {isEqualArray} from "@luke-zhang-04/utils"

type UseFunctionMemoPromiseReturn<R, P extends unknown[]> = [
    /**
     * Memoized function
     */
    memoFunc: (...args: P) => Promise<R>,
    /**
     * Look for something in the cache and return undefiend if it's not there
     */
    searchCache: (...args: P) => R | undefined,
]

/**
 * Creates a function that memoizes it's results, and can be called whenever
 *
 * @param func - Function to memoize result for
 * @param deps - Dependencies of function that should change function result
 * @returns Function that produces memoized results
 * @warn this function can result in O(n^2) runtime, use with caution
 */
export const useFunctionMemoPromise = <
    R,
    P extends unknown[],
    D extends unknown[] | undefined = P,
>(
    func: (...args: P) => Promise<R>,
    deps?: D,
): UseFunctionMemoPromiseReturn<R, P> => {
    const cache = React.useRef<[D extends undefined ? P : D, R][]>([])

    const memoFunc = async (...args: P): Promise<R> => {
        const cacheEntry = cache.current.find(([_deps]) => isEqualArray(args, _deps, 1))

        if (cacheEntry === undefined) {
            const res = await func(...args)

            cache.current.push([(deps ?? args) as D extends undefined ? P : D, res])

            return res
        }

        return cacheEntry[1]
    }

    const searchCache = (...args: P): R | undefined =>
        cache.current.find(([_deps]) => isEqualArray(args, _deps, 1))?.[1]

    return [memoFunc, searchCache]
}

export default useFunctionMemoPromise
