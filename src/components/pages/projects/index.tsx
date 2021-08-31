/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
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
import {useAdapter} from "~/hooks"

const Project: React.FC<{project: ProjectsType[0]; user?: User}> = ({project, user}) => (
    <GridItem
        imageURL={project.coverImageURL ?? undefined}
        title={project.name ?? ""}
        link={{to: `/project/${project.id}`, text: "Details"}}
    >
        {
            // This project belongs to this user
            user?.uid === project.creatorId && (
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

export const Projects: React.FC<{competitionId: string}> = ({competitionId}) => {
    const {data: projects} = useAdapter(
        () => projectsAdapter(competitionId),
        async () => projectsSchema.validate(await cache.read("talentmakerCache_projects")),
    )
    const {currentUser: user} = React.useContext(UserContext)

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
                    <Breadcrumb.Item
                        linkAs={Link}
                        linkProps={{to: `/competition/${competitionId}`}}
                    >
                        {competitionId}
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
