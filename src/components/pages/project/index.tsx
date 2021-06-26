/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import * as Components from "~/components/detailedItem"
import {Breadcrumb, Button, Col, Container, Row} from "react-bootstrap"
import {Project as ProjectType, projectSchema} from "~/schemas/project"
import {Spinner, initTooltips} from "~/components/bootstrap"
import {readCache, validate} from "~/utils"
import {Link} from "react-router-dom"
import Markdown from "~/components/markdown"
import Prism from "prismjs"
import React from "react"
import UserContext from "~/contexts/userContext"
import getProjectData from "./utils"
import projectAdapter from "~/adapters/project"
import scrollToHeader from "~/components/markdown/scrollToHeader"
import styles from "~/components/markdown/styles.module.scss"

type Props = {
    /**
     * Project id
     */
    id?: string

    /**
     * Competition id
     */
    compId?: string
}

export const Project: React.FC<Props> = (props) => {
    const [project, setProject] = React.useState<ProjectType | undefined>()
    const {currentUser: user} = React.useContext(UserContext)

    const setup = React.useCallback(() => {
        ;(async () => {
            const data = await readCache(`talentmakerCache_project-${props.id}`)

            setProject(await validate(projectSchema, data, false))
        })()
        ;(async () => {
            const data = await projectAdapter(user, props.id, props.compId)

            if (!(data instanceof Error)) {
                setProject(data)
            }
        })()
    }, [props.id, props.compId, user])

    React.useEffect(() => {
        setup()

        if (window.location.hash) {
            scrollToHeader(window.location.hash)
        }
    }, [props.id, props.compId, user])

    React.useEffect(() => {
        Prism.highlightAll()

        initTooltips()
    })

    const getData = React.useCallback(getProjectData, [])

    if (project) {
        const data = getData(project)

        return (
            <>
                <Breadcrumb className="container-fluid" listProps={{className: "mb-0"}}>
                    <Breadcrumb.Item linkAs={Link} linkProps={{to: "/competitions"}}>
                        Competitions
                    </Breadcrumb.Item>
                    <Breadcrumb.Item
                        linkAs={Link}
                        linkProps={{to: `/competition/${project.competitionId}`}}
                    >
                        {project.competitionId}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item
                        linkAs={Link}
                        linkProps={{to: `/projects/${project.competitionId}`}}
                    >
                        Submissions
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>{project.id}</Breadcrumb.Item>
                </Breadcrumb>
                <Components.UserInfo
                    username={project.name ?? "Submission"}
                    desc={`Submission for ${project.name ?? "Submission"}`}
                >
                    {(user?.sub ?? "") === project.creator ? (
                        <Button
                            variant="outline-dark"
                            as={Link}
                            className="mx-2"
                            to={`/editProject/${project.id}`}
                        >
                            <span className="material-icons">create</span> Edit Submission
                        </Button>
                    ) : undefined}
                </Components.UserInfo>
                <Components.Bar topics={project.topics} />
                <Row>
                    <Col lg={9}>
                        <Components.Video title="competition video" src={data.src} />
                        <div className={`${styles.markdownContainer} py-3 px-gx`}>
                            <Container fluid className="p-4 bg-lighter">
                                <Markdown>{project.desc ?? ""}</Markdown>
                            </Container>
                        </div>
                    </Col>
                    <Col lg={3} className="bg-lighter">
                        <Components.Sidebar items={data.items} />
                    </Col>
                </Row>
            </>
        )
    }

    return <Spinner color="primary" size="25vw" className="my-5" centered />
}

export default Project
