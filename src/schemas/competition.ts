/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import * as yup from "yup"

export const competitionSchema = yup.object({
    id: yup.number().required(),
    name: yup.string().nullable(),
    desc: yup.string().nullable(),
    videoURL: yup.string().nullable(),
    deadline: yup.date().required(),
    website: yup.string().nullable(),
    email: yup.string().required(),
    orgId: yup.string().required(),
    coverImageURL: yup.string().nullable(),
    orgName: yup.string().required(),
    topics: yup.array(yup.string()).nullable(),
    shortDesc: yup.string(),
    inComp: yup.boolean(),
    hasProject: yup.boolean(),
})

export type Competition = typeof competitionSchema.__outputType
