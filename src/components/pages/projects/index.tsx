/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {Breadcrumb, Button, Container, Row} from "react-bootstrap"
import {Projects as ProjectsType, projectsSchema} from "~/schemas/projects"
import {Spinner, initTooltips} from "~/components/bootstrap"
import GridItem from "~/components/gridItem"
import {Link} from "react-router-dom"
import React from "react"
import UserContext from "~/contexts/userContext"
import {arrayToChunks} from "@luke-zhang-04/utils"
import cache from "~/utils/cache"
import projectsAdapter from "~/adapters/projects"
import {validate} from "~/utils"

const Project: React.FC<{project: ProjectsType[0]; user?: User}> = ({project, user}) => (
    <GridItem
        imageURL={project.coverImageURL ?? undefined}
        title={project.name ?? ""}
        link={{to: `/project/${project.id}`, text: "Details"}}
    >
        {
            // This project belongs to this user
            user?.sub === project.creator && (
                <Button
                    as={Link}
                    variant="outline-dark"
                    to={`/editProject/${project.id}`}
                    className="d-inline-block float-end"
                    data-bs-toggle="tooltip"
                    data-bs-placement="left"
                    title="Edit"
                >
                    <span className="material-icons">create</span>
                </Button>
            )
        }
    </GridItem>
)

export const Projects: React.FC<{compId: string}> = ({compId}) => {
    const [projects, setProjects] = React.useState<ProjectsType | undefined>()
    const {currentUser: user} = React.useContext(UserContext)

    React.useEffect(() => {
        ;(async () => {
            const data = await cache.read("talentmakerCache_projects")

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

    const getSortedProjects = React.useCallback((_projects: ProjectsType): ProjectsType[][] => {
        // Projects due in the future and past
        const advancing: ProjectsType = []
        const submitted = _projects ?? []

        return [arrayToChunks(advancing), arrayToChunks(submitted)]
    }, [])

    if (projects) {
        const sortedCompetitions = getSortedProjects(projects)

        return (
            <Container fluid>
                <Breadcrumb>
                    <Breadcrumb.Item linkAs={Link} linkProps={{to: "/competitions"}}>
                        Competitions
                    </Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} linkProps={{to: `/competition/${compId}`}}>
                        {compId}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Submissions</Breadcrumb.Item>
                </Breadcrumb>
                <h1 className="my-3">Advancing</h1>
                {(sortedCompetitions[0]?.length ?? 0) > 0 ? (
                    sortedCompetitions[0].map((row, index) => (
                        <Row key={`project-row-${index}`} className="g-3">
                            {row.map((project, index2) => (
                                <Project
                                    key={`comp-item-0-${index}-${index2}`}
                                    project={project}
                                    user={user}
                                />
                            ))}
                        </Row>
                    ))
                ) : (
                    <p>None</p>
                )}

                <h1 className="mb-3">Submitted</h1>
                {sortedCompetitions[1]?.map((row, index) => (
                    <Row key={`project-row-${index}`} className="g-3">
                        {row.map((project, index2) => (
                            <Project
                                key={`comp-item-1-${index}-${index2}`}
                                project={project}
                                user={user}
                            />
                        ))}
                    </Row>
                ))}
            </Container>
        )
    }

    return <Spinner color="primary" size="25vw" className="my-5" centered />
}

export default Projects
