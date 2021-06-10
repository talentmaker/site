/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file utility Functions
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

/* eslint-disable prefer-arrow/prefer-arrow-functions */

/**
 * Tries to execute `func` and discards any error that occurs
 *
 * @param func - Callback function
 * @param shouldKeepError - If error should be returned
 */
export function inlineTry<T>(func: () => T, shouldKeepError: false): T | undefined

/**
 * Tries to execute `func` and return any error that occurs
 *
 * @param func - Callback function
 * @param shouldKeepError - If error should be returned
 */
export function inlineTry<T>(func: () => T, shouldKeepError?: true): T | Error

export function inlineTry<T>(func: () => T, shouldKeepError = true): T | Error | undefined {
    try {
        return func()
    } catch (err: unknown) {
        if (shouldKeepError) {
            return err instanceof Error ? err : new Error(String(err))
        }

        return
    }
}

/**
 * Tries to await `func` and discards any error that occurs
 *
 * @param func - Callback function
 * @param shouldKeepError - If error should be returned
 */
export async function inlineTryPromise<T>(
    func: () => Promise<T>,
    shouldKeepError: false,
): Promise<T | undefined>

/**
 * Tries to await `func` and returns any error that occurs
 *
 * @param func - Callback function
 * @param shouldKeepError - If error should be returned
 */
export async function inlineTryPromise<T>(
    func: () => Promise<T>,
    shouldKeepError?: true,
): Promise<T | Error>

export async function inlineTryPromise<T>(
    func: () => Promise<T>,
    shouldKeepError = true,
): Promise<T | Error | undefined> {
    try {
        return await func()
    } catch (err: unknown) {
        if (shouldKeepError) {
            return err instanceof Error ? err : new Error(String(err))
        }

        return
    }
}

/* eslint-enable prefer-arrow/prefer-arrow-functions */
