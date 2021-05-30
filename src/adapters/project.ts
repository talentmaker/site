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
    async (
        {adapterError, request, url, cache, schema, qs},
        user: User | undefined,
        id?: string,
        compId?: string,
    ) => {
        let queryString

        console.log({user, id, compId})

        if (id) {
            queryString = qs.stringify({id})
        } else if (compId && user) {
            queryString = qs.stringify({sub: user.sub, competitionId: compId})
        } else {
            throw adapterError("Invalid Params")
        }
        const data = await request(`${url}/projects/getOne?${queryString}`, "GET", "json")
        const project = await schema.validate(data)

        cache.write(`talentmakerCache_project-${id}`, data)

        return project
    },
    projectSchema,
)

export default projectAdapter
