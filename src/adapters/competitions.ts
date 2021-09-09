/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {competitionsSchema} from "../schemas/competitions"
import {createAdapter} from "./utils"

export const competitionsAdapter = createAdapter(async ({request, url, cache, schema}) => {
    const data = await request(`${url}/competitions/getMany`, "GET", "json")
    const competitions = await schema.validate(data)

    cache.write(
        "talentmakerCache_competitions",
        competitions.map((competition) => ({
            ...competition,
            desc: undefined, // Remove descriptions; They're long and aren't used in this context
        })),
    )

    return competitions
}, competitionsSchema)

export default competitionsAdapter
