/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {createAdapter} from "../utils"
import {userSchema} from "~/schemas/user"

export const loginAdapter = createAdapter(
    async ({request, url, schema}, email: string, password: string) =>
        await schema.validate(
            await request(
                `${url}/auth/login`,
                "POST",
                "json",
                {
                    email,
                    password,
                },
                undefined,
                {credentials: "include"},
            ),
        ),
    userSchema,
)

export default loginAdapter
