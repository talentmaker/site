/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {createAdapter} from "./utils"
import {userSchema} from "~/schemas/user"

export const login = createAdapter(
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
export const confirm = createAdapter(async ({request, url}, idToken: string) => {
    const result = await request(`${url}/auth/confirm`, "POST", "json", {
        idToken,
    })

    console.log(result)
})

export const register = createAdapter(
    async ({request, url}, username: string, email: string, password: string) => {
        await request(`${url}/auth/register`, "POST", "text", {
            username,
            email,
            password,
        })
    },
)

export const tokens = createAdapter(
    async ({request, url, schema}) =>
        await schema.validate(
            await request(`${url}/auth/tokens`, "GET", "json", undefined, undefined, {
                credentials: "include",
            }),
        ),
    userSchema,
    false,
)
