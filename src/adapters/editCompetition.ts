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

export const editCompetitionAdapter = createAdapter(
    async ({request, url}, {idToken, idTokenChecksum}: User, params: {[key: string]: unknown}) => {
        await request(`${url}/competitions/write`, "POST", undefined, {
            ...params,
            idToken,
            idTokenChecksum,
        })

        return undefined
    },
)

export default editCompetitionAdapter
