/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as adapters from "~/adapters"
import {Breadcrumb, Container, Row} from "react-bootstrap"
import {Projects as ProjectsType, projectsSchema} from "~/schemas/projects"
import GridItem from "~/components/gridItem"
import {Link} from "react-router-dom"
import React from "react"
import {Spinner} from "~/components/bootstrap"
import UserContext from "~/contexts/userContext"
import {arrayToChunks} from "@luke-zhang-04/utils"
import cache from "~/utils/cache"
import {useAdapter} from "~/hooks"

const Project: React.FC<{project: ProjectsType[0]; user?: User}> = ({project, user}) => {
    const isOwner = user !== undefined && project.creatorId === user.uid
    const isTeamMember =
        user !== undefined && project.teamMembers.some((teamMember) => teamMember.uid === user.uid)

    let userStatus: string | undefined

    if (isOwner) {
        userStatus = "Your project"
    } else if (isTeamMember) {
        userStatus = "You team's project"
    }

    return (
        <GridItem
            imageURL={project.coverImageURL ?? undefined}
            title={project.name ?? ""}
            link={{to: `/project/${project.id}`, text: "Details"}}
        >
            {userStatus}
        </GridItem>
    )
}

export const Projects: React.FC<{competitionId: string}> = ({competitionId}) => {
    const {data: projects} = useAdapter(
        () => adapters.project.getMany(competitionId),
        () => projectsSchema.validate(cache.read("talentmakerCache_projects")),
    )
    const {currentUser: user} = React.useContext(UserContext)

    const getSortedProjects = (_projects: ProjectsType): ProjectsType[][] => {
        // Projects due in the future and past
        const advancing: ProjectsType = []
        const submitted = _projects ?? []

        return [arrayToChunks(advancing), arrayToChunks(submitted)]
    }

    if (projects) {
        const sortedProjects = getSortedProjects(projects)

        return (
            <Container fluid className="py-3">
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
                {sortedProjects[0]?.length ? (
                    sortedProjects[0].map((row, index) => (
                        <Row key={`project-row-${index}`} className="g-3 mt-0">
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
                {sortedProjects[0]?.length ? (
                    sortedProjects[1]?.map((row, index) => (
                        <Row key={`project-row-${index}`} className="g-3 mt-0">
                            {row.map((project, index2) => (
                                <Project
                                    key={`comp-item-1-${index}-${index2}`}
                                    project={project}
                                    user={user}
                                />
                            ))}
                        </Row>
                    ))
                ) : (
                    <p>None</p>
                )}
            </Container>
        )
    }

    return <Spinner color="primary" size="25vw" className="my-5" centered />
}

export default Projects
