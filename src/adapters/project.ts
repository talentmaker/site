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
import {projectsSchema} from "../schemas/projects"

type CreateParams = {
    title: string
    competitionId: number
    desc?: string | null
    srcURL?: string | null
    demoURL?: string | null
    license?: string | null
    videoURL?: string | null
}

export const create = createAdapter(
    async ({request, url}, {idToken}: User, params: CreateParams) => {
        await request(`${url}/projects/write`, "POST", undefined, {
            ...params,
            idToken,
        })

        return undefined
    },
)

export const get = createAdapter(
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

export const getMany = createAdapter(
    async ({request, url, cache, schema}, competitionId: string) => {
        const data = await request(
            `${url}/projects/getMany?column=competitionId&value=${competitionId}`,
            "GET",
            "json",
        )
        const projects = await schema.validate(data)

        cache.write(
            `talentmakerCache_projects_${competitionId}`,
            projects.map((project) => ({
                ...project,
                desc: undefined, // Remove descriptions; They're long and aren't used in this context
            })),
        )

        return projects
    },
    projectsSchema,
)

export const getManyByUser = createAdapter(async ({request, url, qs, schema}, user: User) => {
    const data = await request(
        qs.stringifyUrl({
            url: `${url}/projects/getMany`,
            query: {column: "teamMember", value: user.uid, sortBy: "createdAt"},
        }),
        "GET",
        "json",
    )
    const projects = await schema.validate(data)

    return projects
}, projectsSchema)

type UpdateParams = Partial<CreateParams> & {
    projectId?: string | number
}

export const update = createAdapter(
    async ({request, url}, {idToken}: User, params: UpdateParams) => {
        await request(`${url}/projects/write`, "PUT", undefined, {
            ...params,
            idToken,
        })

        return undefined
    },
)
