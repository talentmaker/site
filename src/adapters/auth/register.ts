/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {createAdapter} from "../utils"

export const registrationAdapter = createAdapter(
    async ({request, url}, username: string, email: string, password: string) => {
        await request(`${url}/auth/register`, "POST", "text", {
            username,
            email,
            password,
        })
    },
)

export default registrationAdapter
