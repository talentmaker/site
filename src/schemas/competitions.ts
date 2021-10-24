/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as yup from "yup"

export const bulkCompetitionSchema = yup.object({
    id: yup.number().required(),
    name: yup.string().nullable(),
    desc: yup.string().nullable(),
    videoURL: yup.string().nullable(),
    deadline: yup.date(),
    website: yup.string().nullable(),
    email: yup.string().nullable(),
    organizationId: yup.string().required(),
    coverImageURL: yup.string().nullable(),
    orgName: yup.string(),
    shortDesc: yup.string(),
})

export type BulkCompetitionType = typeof bulkCompetitionSchema.__outputType

export const competitionsSchema = yup.array(bulkCompetitionSchema).required()

export type Competitions = typeof competitionsSchema.__outputType
