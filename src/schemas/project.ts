/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as yup from "yup"

export const projectSchema = yup.object({
    id: yup.number().required(),
    creator: yup.string().required(),
    createdAt: yup.date().required(),
    desc: yup.string().nullable(),
    srcURL: yup.string().nullable(),
    demoURL: yup.string().nullable(),
    license: yup.string().nullable(),
    videoURL: yup.string().nullable(),
    coverImageURL: yup.string().nullable(),
    competitionId: yup.string().required(),
    topics: yup.array(yup.string()).nullable(),
    name: yup.string().required(),
    creatorUsername: yup.string().required(),
    competitionName: yup.string().required(),
    teamMembers: yup
        .array(
            yup.object({
                uid: yup.string().required(),
                username: yup.string().required(),
                desc: yup.string().nullable(),
                role: yup.string().nullable(),
                isCreator: yup.boolean().required(),
            }),
        )
        .required(),
})

export type Project = typeof projectSchema.__outputType
