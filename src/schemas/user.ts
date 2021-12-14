/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as yup from "yup"
import {projectsSchema} from "./projects"

export const userSchema = yup.object({
    idToken: yup.string().required(),
    email: yup.string().required(),
    uid: yup.string().required(),
    username: yup.string().required(),
    isVerified: yup.boolean().required(),
    isOrganization: yup.boolean().required().default(false),
})

export type CognitoUser = typeof userSchema.__outputType

export const publicDbBareUserSchema = yup.object({
    uid: yup.string().required(),
    username: yup.string().required(),
})

export type PublicDbBareUser = typeof publicDbBareUserSchema.__outputType

export const publicDbBulkUserSchema = yup.array(
    publicDbBareUserSchema.shape({projectCount: yup.number().required()}),
)

export type PublicDbBulkUser = typeof publicDbBulkUserSchema.__outputType

export const publicDbUserSchema = yup.object({
    uid: yup.string().required(),
    username: yup.string().required(),
    projects: projectsSchema.optional(),
})

export type PublicDbUser = typeof publicDbUserSchema.__outputType
