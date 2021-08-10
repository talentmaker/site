/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
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
    async ({request, url, cache, schema}, user: User | undefined, id: string) => {
        const userQS = user ? `&idToken=${user.idToken}` : ""
        const data = await request(`${url}/competitions/getOne?id=${id}${userQS}`, "GET", "json")
        const competition = await schema.validate(data)

        cache.write(`talentmakerCache_competition-${id}`, data)

        return competition
    },
    competitionSchema,
)

export default competitionAdapter
