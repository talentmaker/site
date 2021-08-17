/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {createAdapter} from "../utils"
import {userSchema} from "~/schemas/user"

export const tokenAdapter = createAdapter(
    async ({request, url, schema}) =>
        await schema.validate(
            await request(`${url}/auth/tokens`, "GET", "json", undefined, undefined, {
                credentials: "include",
            }),
        ),
    userSchema,
)

export default tokenAdapter
