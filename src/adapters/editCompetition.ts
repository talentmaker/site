/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {createAdapter} from "./utils"

type Params = {
    title?: string | null
    desc?: string | null
    shortDesc?: string
    id: number
    videoURL?: string | null
    deadline?: string
    website?: string | null
    coverImageURL?: string | null
}

export const editCompetitionAdapter = createAdapter(
    async ({request, url}, {idToken}: User, params: Params) => {
        await request(`${url}/competitions/write`, "PUT", undefined, {
            ...params,
            idToken,
        })

        return undefined
    },
)

export default editCompetitionAdapter
