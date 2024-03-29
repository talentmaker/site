/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as yup from "yup"

export const projectsSchema = yup
    .array(
        yup.object({
            id: yup.number().required(),
            creatorId: yup.string().required(),
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
            teamMembers: yup
                .array(
                    yup.object({
                        uid: yup.string().required(),
                    }),
                )
                .required(),
        }),
    )
    .required()

export type Projects = typeof projectsSchema.__outputType
