/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {createAdapter} from "./utils"
import {projectSchema} from "../schemas/project"

export const projectAdapter = createAdapter(
    async (
        {adapterError, request, url, cache, schema, qs},
        user: User | undefined,
        id?: string,
        competitionId?: string,
    ) => {
        let queryString

        if (id) {
            queryString = qs.stringify({id})
        } else if (competitionId && user) {
            queryString = qs.stringify({uid: user.uid, competitionId})
        } else {
            throw adapterError("Invalid Params")
        }
        const data = await request(`${url}/projects/get?${queryString}`, "GET", "json")
        const project = await schema.validate(data)

        cache.write(`talentmakerCache_project-${id}`, data)

        return project
    },
    projectSchema,
)

export default projectAdapter
