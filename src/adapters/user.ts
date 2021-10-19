/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {createAdapter} from "./utils"
import {publicDbUserSchema} from "~/schemas/user"

export const getWithProjects = createAdapter(async ({qs, request, schema, url}, uid: string) => {
    const user = await request(
        `${url}/users/get/${uid}?${qs.stringify({shouldFetchProjects: true})}`,
        "GET",
        "json",
    )

    console.log(user)

    return schema.validate(user)
}, publicDbUserSchema)
