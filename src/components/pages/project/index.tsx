/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as Components from "~/components/detailedItem"
import {Breadcrumb, Button, Col, Container, Row} from "react-bootstrap"
import {Project as ProjectType, projectSchema} from "~/schemas/project"
import {Spinner, initPopovers, initTooltips} from "~/components/bootstrap"
import {readCache, validate} from "~/utils"
import {Link} from "react-router-dom"
import Markdown from "~/components/markdown"
import Prism from "prismjs"
import React from "react"
import {UserContext} from "~/contexts"
import getProjectData from "./utils"
import {invliteLinkAdapter} from "~/adapters/teams"
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
    competitionId?: string
}

export const Project: React.FC<Props> = (props) => {
    const [project, setProject] = React.useState<ProjectType | undefined>()
    const [inviteLink, setInviteLink] = React.useState<string | string>()
    const {currentUser: user} = React.useContext(UserContext)

    const setup = React.useCallback(() => {
        ;(async () => {
            if (props.id) {
                const data = await readCache(`talentmakerCache_project-${props.id}`)

                setProject(await validate(projectSchema, data, false))
            }
        })()
        ;(async () => {
            const data = await projectAdapter(user, props.id, props.competitionId)

            if (!(data instanceof Error)) {
                setProject({
                    ...data,
                    teamMembers: data.teamMembers.sort(({isCreator}) => (isCreator ? -1 : 1)),
                })
            }
        })()
    }, [props.id, props.competitionId, user])

    React.useEffect(() => {
        setup()

        if (window.location.hash) {
            scrollToHeader(window.location.hash)
        }
    }, [props.id, props.competitionId, user])

    React.useEffect(() => {
        Prism.highlightAll()

        initTooltips()
        initPopovers()
    })

    const getData = React.useCallback(getProjectData, [])
    const data = React.useMemo(() => getData(project), [project, project?.license, project?.id])
    const setInviteLinkState = React.useCallback(async () => {
        if (user && project) {
            const link = await invliteLinkAdapter(
                user,
                project?.id.toString(),
                project?.competitionId,
            )

            if (!(link instanceof Error)) {
                setInviteLink(`${window.location.origin}/joinTeam/${link.urlSuffix}`)
            }
        }
    }, [project, project?.id, project?.competitionId])

    if (project && data) {
        const management = user && user.uid === project?.creator && (
            <Container fluid className="p-4 my-3 bg-lighter">
                <h1>Management</h1>
                <Button onClick={setInviteLinkState} variant="outline-dark">
                    <span className="material-icons">groups</span> Generate Invite link
                </Button>
                {inviteLink && (
                    <p className="mt-3">
                        Your invite link is: &quot;
                        <code>{inviteLink}</code>
                        &quot;.{" "}
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events */}
                        <a
                            tabIndex={0}
                            role="button"
                            data-bs-toggle="popover"
                            data-bs-trigger="focus"
                            data-bs-content="Copied to clipboard"
                            className="icon-btn"
                            onClick={() => {
                                window.navigator.clipboard.writeText(inviteLink)
                            }}
                        >
                            <span className="material-icons">content_copy</span>
                        </a>{" "}
                        Only share this link with people you intend on adding to your team. Team
                        members have editing privileges. This link expires in 24 hours.
                    </p>
                )}
            </Container>
        )
        const mainDisplay = (
            <Col lg={9}>
                <Components.Video title="competition video" src={data.src} />
                <div className={`${styles.markdownContainer} py-3 px-gx`}>
                    <Container fluid className="p-4 bg-lighter">
                        <Markdown>{project.desc ?? ""}</Markdown>
                    </Container>
                    {management}
                </div>
            </Col>
        )

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
                    {project.teamMembers.some((member) => member.uid === user?.uid) ? (
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
                    {mainDisplay}
                    <Col lg={3} className="bg-lighter">
                        <Components.Sidebar items={data.items}>
                            <h2>Team</h2>
                            <ul>
                                {project.teamMembers.map(
                                    (member): JSX.Element =>
                                        member.isCreator ? (
                                            <li>
                                                <b>Creator: </b>
                                                {member.username}
                                            </li>
                                        ) : (
                                            <li>
                                                <b>Member: </b>
                                                {member.username}
                                            </li>
                                        ),
                                )}
                            </ul>
                        </Components.Sidebar>
                    </Col>
                </Row>
            </>
        )
    }

    return <Spinner color="primary" size="25vw" className="my-5" centered />
}

export default Project
