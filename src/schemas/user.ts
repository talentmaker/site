/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import * as yup from "yup"

export const userSchema = yup.object({
    idToken: yup.string().required(),
    refreshToken: yup.string(),
    accessToken: yup.string().required(),
    email: yup.string().required(),
    sub: yup.string().required(),
    username: yup.string().required(),
    isOrg: yup.boolean(),
})

export type CognitoUser = typeof userSchema.__outputType

export const isUser = (obj: unknown): obj is CognitoUser => {
    try {
        userSchema.validateSync(obj)

        return true
    } catch {
        return false
    }
}
