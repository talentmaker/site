/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {publicDbBulkUserSchema, publicDbUserSchema} from "~/schemas/user"
import {createAdapter} from "./utils"

export const getWithProjects = createAdapter(async ({qs, request, schema, url}, uid: string) => {
    const user = await request(
        `${url}/users/get/${uid}?${qs.stringify({shouldFetchProjects: true})}`,
        "GET",
        "json",
    )

    return schema.validate(user)
}, publicDbUserSchema)

export const getMany = createAdapter(async ({qs, request, schema, url}, search?: string) => {
    const users = await request(`${url}/users/getMany?${qs.stringify({search})}`, "GET", "json")

    return schema.validate(users)
}, publicDbBulkUserSchema)
