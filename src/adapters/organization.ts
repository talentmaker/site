/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {createAdapter} from "./utils"

export const request = createAdapter(async ({request: _request, url}, {idToken}: User) => {
    await _request(
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
