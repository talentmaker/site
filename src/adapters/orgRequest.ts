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

export const orgRequestAdapter = createAdapter(
    async ({request, url}, {idToken, idTokenChecksum}: User) => {
        await request(
            `${url}/organization/request`,
            "POST",
            "json",
            {
                idToken,
                idTokenChecksum,
            },
            undefined,
            {credentials: "include"},
        )

        return undefined
    },
)

export default orgRequestAdapter
