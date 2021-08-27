/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {createAdapter} from "./utils"

export const orgRequestAdapter = createAdapter(async ({request, url}, {idToken}: User) => {
    await request(
        `${url}/organization/request`,
        "POST",
        "json",
        {
            idToken,
        },
        undefined,
        {credentials: "include"},
    )

    return undefined
})

export default orgRequestAdapter
