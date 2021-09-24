/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as yup from "yup"

export const githubRepoResult = yup.object({
    name: yup.string().required(),
    html_url: yup.string().required(),
    description: yup.string().required().nullable(),
    homepage: yup.string().nullable(),
    license: yup
        .object({
            name: yup.string().required(),
            spdx_id: yup.string().required(),
        })
        .required()
        .nullable(),
})

export type GithubRepoResult = typeof githubRepoResult["__outputType"]

export const githubLicenseResult = yup.object({
    html_url: yup.string().required(),
})

export type GithubLicenseResult = typeof githubRepoResult["__outputType"]

export const githubReadmeResult = yup.object({
    content: yup.string().required(),
    encoding: yup.string().required().oneOf(["base64"]),
})
