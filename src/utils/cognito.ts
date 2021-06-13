/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

export type AwsErrorObject = {
    code: string
    name: string
    message: string
}

export const isAwsErrorObject = (obj: unknown): obj is AwsErrorObject =>
    typeof obj === "object" &&
    typeof (obj as {[key: string]: unknown})?.code === "string" &&
    typeof (obj as {[key: string]: unknown})?.name === "string" &&
    typeof (obj as {[key: string]: unknown})?.message === "string"
