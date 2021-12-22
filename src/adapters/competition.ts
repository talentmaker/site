/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as yup from "yup"
import {competitionSchema} from "../schemas/competition"
import {competitionsSchema} from "../schemas/competitions"
import {createAdapter} from "./utils"

export const join = createAdapter(
    async ({request, url}, {idToken}: User, competitionId: number) => {
        await request(`${url}/competitions/join`, "POST", undefined, {
            idToken,
            competitionId,
        })

        return undefined
    },
)

export const create = createAdapter(async ({request, url, schema}, {idToken, username}: User) => {
    const res = await request(`${url}/competitions/write`, "POST", "json", {
        idToken,
        shortDesc: `Competition by ${username}`,
    })

    return await schema.validate(res)
}, yup.object({id: yup.number().required()}))

export const get = createAdapter(
    async ({request, url, cache, qs, schema}, uid: string | undefined, id: string) => {
        const data = await request(
            `${url}/competitions/get?${qs.stringify({id, uid})}`,
            "GET",
            "json",
        )
        const competition = await schema.validate(data)

        cache.write(`talentmakerCache_competition-${id}`, data)

        return competition
    },
    competitionSchema,
)

export const getMany = createAdapter(
    async ({request, url, cache, schema, qs}, search?: string) => {
        const data = await request(
            qs.stringifyUrl({url: `${url}/competitions/getMany`, query: {search}}),
            "GET",
            "json",
        )
        const competitions = await schema.validate(data)

        if (search) {
            cache.write(
                "talentmakerCache_competitions",
                competitions.map((competition) => ({
                    ...competition,
                    desc: undefined, // Remove descriptions; They're long and aren't used in this context
                })),
            )
        }

        return competitions
    },
    competitionsSchema,
)
type UpdateParams = {
    title?: string | null
    desc?: string | null
    shortDesc?: string
    id: number
    videoURL?: string | null
    deadline?: string
    website?: string | null
    coverImageURL?: string | null
}

export const update = createAdapter(
    async ({request, url}, {idToken}: User, params: UpdateParams) => {
        await request(`${url}/competitions/write`, "PUT", undefined, {
            ...params,
            idToken,
        })

        return undefined
    },
)
