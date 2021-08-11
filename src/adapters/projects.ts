/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {createAdapter} from "./utils"
import {projectsSchema} from "../schemas/projects"

export const projectsAdapter = createAdapter(
    async ({request, url, cache, schema}, compId: string) => {
        const data = await request(
            `${url}/projects/get?column=competitionId&value=${compId}`,
            "GET",
            "json",
        )
        const projects = await schema.validate(data)

        cache.write(
            "talentmakerCache_projects",
            projects.map((project) => ({
                ...project,
                desc: undefined, // Remove descriptions; They're long and aren't used in this context
            })),
        )

        return projects
    },
    projectsSchema,
)

export default projectsAdapter
