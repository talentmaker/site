/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {createAdapter} from "./utils"
import {projectSchema} from "../schemas/project"

export const projectAdapter = createAdapter(
    async ({request, url, cache, schema}, user: User | undefined, id: string) => {
        const userQS = user
            ? `&idToken=${user.idToken}&idTokenChecksum=${user.idTokenChecksum}`
            : ""
        const data = await request(`${url}/projects/getOne?id=${id}${userQS}`, "GET", "json")
        const project = await schema.validate(data)

        cache.write(`talentmakerCache_project-${id}`, data)

        return project
    },
    projectSchema,
)

export default projectAdapter
