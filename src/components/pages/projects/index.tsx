/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {Projects as ProjectsType, projectsSchema} from "../../../schemas/projects"
import {Spinner, initTooltips} from "../../bootstrap"
import {arrayToChunks, validate} from "../../../utils"
import GridItem from "../../gridItem"
import {Link} from "react-router-dom"
import React from "react"
import UserContext from "../../../contexts/userContext"
import cache from "../../../utils/cache"
import projectsAdapter from "../../../adapters/projects"

const Project: React.FC<{project: ProjectsType[0]; user?: User}> = ({project, user}) => (
    <GridItem
        imageURL={project.coverImageURL ?? undefined}
        title={project.name}
        link={{to: `/project/${project.id}`, text: "Details"}}
    >
        {
            // This project belongs to this user
            user?.sub === project.creator ? (
                <Link
                    to={`/editProject/${project.id}`}
                    className="btn btn-outline-dark d-inline-block float-end"
                    data-bs-toggle="tooltip"
                    data-bs-placement="left"
                    title="Edit"
                >
                    <span className="material-icons">create</span>
                </Link>
            ) : undefined
        }
    </GridItem>
)

export const Projects: React.FC<{compId: string}> = ({compId}) => {
    const [projects, setProjects] = React.useState<ProjectsType | undefined>()
    const {currentUser: user} = React.useContext(UserContext)

    React.useEffect(() => {
        ;(async () => {
            const data = await cache.read("talentmakerCache_competitions")

            setProjects(await validate(projectsSchema, data, false))
        })()
        ;(async () => {
            const data = await projectsAdapter(compId)

            if (!(data instanceof Error)) {
                setProjects(data)
            }
        })()
    }, [])

    React.useEffect(() => {
        initTooltips()
    })

    const getSortedProjects = React.useCallback((): ProjectsType[][] => {
        // Projects due in the future and past
        const advancing: ProjectsType = []
        const submitted = projects ?? []

        return [arrayToChunks(advancing), arrayToChunks(submitted)]
    }, [projects])

    if (projects) {
        const sortedCompetitions = getSortedProjects()

        return (
            <div className="container-fluid">
                <h1 className="my-3">Advancing</h1>
                {(sortedCompetitions[0]?.length ?? 0) > 0 ? (
                    sortedCompetitions[0].map((row, index) => (
                        <div key={`project-row-${index}`} className="row g-3">
                            {row.map((project, index2) => (
                                <Project
                                    key={`comp-item-0-${index}-${index2}`}
                                    project={project}
                                    user={user}
                                />
                            ))}
                        </div>
                    ))
                ) : (
                    <p>None</p>
                )}

                <h1 className="mb-3">Submitted</h1>
                {sortedCompetitions[1]?.map((row, index) => (
                    <div key={`project-row-${index}`} className="row g-3">
                        {row.map((project, index2) => (
                            <Project
                                key={`comp-item-1-${index}-${index2}`}
                                project={project}
                                user={user}
                            />
                        ))}
                    </div>
                ))}
            </div>
        )
    }

    return <Spinner color="primary" size="25vw" className="my-5" centered />
}

export default Projects
