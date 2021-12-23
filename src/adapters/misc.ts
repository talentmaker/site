/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {createAdapter} from "./utils"

export const contact = createAdapter(
    async (
        {request, url},
        name: string,
        email: string,
        subject: string | undefined,
        message: string,
    ) => {
        await request(`${url}/contact`, "POST", "text", {
            name,
            email,
            subject,
            message,
        })
    },
)
