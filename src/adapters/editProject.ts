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
    competitionId?: string
    projectId?: string | number
    desc?: string | null
    srcURL?: string | null
    demoURL?: string | null
    license?: string | null
    videoURL?: string | null
}

export const editProjectAdapter = createAdapter(
    async ({request, url}, {idToken}: User, params: Params) => {
        await request(`${url}/projects/write`, "PUT", undefined, {
            ...params,
            idToken,
        })

        console.log(params)

        return undefined
    },
)

export default editProjectAdapter
