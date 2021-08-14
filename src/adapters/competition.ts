/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {competitionSchema} from "../schemas/competition"
import {createAdapter} from "./utils"

export const competitionJoinAdapter = createAdapter(
    async ({request, url}, {idToken}: User, competitionId: number) => {
        await request(`${url}/competitions/join`, "POST", undefined, {
            idToken,
            competitionId,
        })

        return undefined
    },
)

export const competitionAdapter = createAdapter(
    async ({request, url, cache, qs, schema}, sub: string | undefined, id: string) => {
        const data = await request(
            `${url}/competitions/getOne?${qs.stringify({id, sub})}`,
            "GET",
            "json",
        )
        const competition = await schema.validate(data)

        cache.write(`talentmakerCache_competition-${id}`, data)

        return competition
    },
    competitionSchema,
)

export default competitionAdapter
