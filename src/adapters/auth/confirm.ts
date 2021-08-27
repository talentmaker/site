/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {createAdapter} from "../utils"

export const confirmAdapter = createAdapter(async ({request, url}, idToken: string) => {
    const result = await request(`${url}/auth/confirm`, "POST", "json", {
        idToken,
    })

    console.log(result)
})

export default confirmAdapter
