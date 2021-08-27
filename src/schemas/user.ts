/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as yup from "yup"

export const userSchema = yup.object({
    idToken: yup.string().required(),
    email: yup.string().required(),
    uid: yup.string().required(),
    username: yup.string().required(),
    isVerified: yup.boolean().required(),
    isOrganization: yup.boolean(),
})

export type CognitoUser = typeof userSchema.__outputType
