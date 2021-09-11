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
    title?: string
    desc?: string
    shortDesc: string
    id: string
    videoURL?: string
    deadline: string
    website?: string
    coverImageURL?: string
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
