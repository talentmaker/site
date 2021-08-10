/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {createAdapter} from "./utils"

type Params = {
    title: string
    compId?: string
    projectId?: string
    desc?: string
    srcURL?: string
    demoURL?: string
    license?: string
    videoURL?: string
}

export const editProjectAdapter = createAdapter(
    async ({request, url}, {idToken}: User, params: Params) => {
        await request(`${url}/projects/write`, "POST", undefined, {
            ...params,
            idToken,
        })

        return undefined
    },
)

export default editProjectAdapter
