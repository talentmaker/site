/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file utility Functions
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as yup from "yup"
import {inlineTryPromise} from "@luke-zhang-04/utils"

/* eslint-disable prefer-arrow/prefer-arrow-functions */

/**
 * Quietly validate data against a yup schema and discard the error or schema
 *
 * @param schema - Yup schema to validate
 * @param data - Data to compare schema against
 * @returns Promise with either an Error if the schema does not match, or the data in validated form
 */
export async function validate<T extends yup.BaseSchema>(
    schema: T,
    data: unknown,
    shouldKeepError: false,
): Promise<T["__outputType"] | undefined>

/**
 * Quietly validate data against a yup schema and return the error or schema
 *
 * @param schema - Yup schema to validate
 * @param data - Data to compare schema against
 * @returns Promise with either an Error if the schema does not match, or the data in validated form
 */
export async function validate<T extends yup.BaseSchema>(
    schema: T,
    data: unknown,
    shouldKeepError?: true,
): Promise<T["__outputType"] | Error>

export async function validate<T extends yup.BaseSchema>(
    schema: T,
    data: unknown,
    shouldKeepError = true,
): Promise<T["__outputType"] | Error | undefined> {
    const result = await inlineTryPromise(() => schema.validate(data))

    if (result instanceof Error) {
        if (!shouldKeepError) {
            return
        }

        result.message = `${result.name}: ${result.message}`
    }

    return result
}

/* eslint-enable prefer-arrow/prefer-arrow-functions */
