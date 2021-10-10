/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as Components from "~/components/detailedItem"
import * as adapters from "~/adapters"
import {Breadcrumb, Button, Col, Container, OverlayTrigger, Popover, Row} from "react-bootstrap"
import {NotificationContext, UserContext} from "~/contexts"
import {readCache, writeCache} from "~/utils"
import EditModal from "./editModal"
import {EditableMarkdown} from "~/components/markdown"
import {Link} from "react-router-dom"
import Prism from "prismjs"
import React from "react"
import {Spinner} from "~/components/bootstrap"
import getProjectData from "./utils"
import {projectSchema} from "~/schemas/project"
import scrollToHeader from "~/components/markdown/scrollToHeader"
import styles from "~/components/markdown/styles.module.scss"
import {useAdapter} from "~/hooks"

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
    const {currentUser: user} = React.useContext(UserContext)
    const {data: project, setData} = useAdapter(
        () => (user ? adapters.project.get(user, props.id, props.competitionId) : undefined),
        () =>
            props.id
                ? projectSchema.validate(readCache(`talentmakerCache_project-${props.id}`))
                : undefined,
        [user],
    )
    const [inviteLink, setInviteLink] = React.useState<string | string>()
    const [shouldShowModal, setShouldShowModal] = React.useState(false)
    const [isDescSaved, setIsDescSaved] = React.useState(true)
    const {addNotification: notify} = React.useContext(NotificationContext)

    React.useEffect(() => {
        if (window.location.hash) {
            scrollToHeader(window.location.hash)
        }
    }, [])

    React.useEffect(() => {
        Prism.highlightAll()
    })

    const getData = React.useCallback(getProjectData, [])
    const setInviteLinkState = React.useCallback(async () => {
        if (user && project) {
            const link = await adapters.team.getInviteLink(
                user,
                project?.id.toString(),
                project?.competitionId,
            )

            if (!(link instanceof Error)) {
                setInviteLink(`${window.location.origin}/joinTeam/${link.urlSuffix}`)
            }
        }
    }, [project, project?.id, project?.competitionId])

    const data = getData(project)

    if (project && data) {
        const isOwner = user !== undefined && user.uid === project?.creatorId
        const isTeamMember =
            user !== undefined && project.teamMembers.some((member) => member.uid === user?.uid)
        const onDescSave = isTeamMember // Why
            ? async (desc: string): Promise<void> => {
                  if (user && project) {
                      setData({...project, desc})

                      const result = await adapters.project.update(user, {
                          desc,
                          projectId: project.id,
                      })

                      if (!(result instanceof Error)) {
                          writeCache(`talentmakerCache_project-${props.id}`, project)

                          setIsDescSaved(true)

                          notify({
                              title: "Success!",
                              content: "Successfully edited your project!",
                              icon: "done_all",
                              iconClassName: "text-success",
                          })
                      }
                  }
              }
            : undefined
        const management = isOwner && (
            <Container fluid className="p-4 my-3 bg-lighter">
                <h1>Management</h1>
                <Button onClick={setInviteLinkState} variant="outline-dark">
                    <span className="material-icons">groups</span> Generate Invite link
                </Button>
                {inviteLink && (
                    <p className="mt-3">
                        Your invite link is:
                        <br />
                        &quot;
                        <code>{inviteLink}</code>
                        &quot;.
                        <OverlayTrigger
                            trigger="click"
                            placement="right"
                            rootClose
                            overlay={
                                <Popover id="clipboard-popover">
                                    <Popover.Body>Copied to clipboard</Popover.Body>
                                </Popover>
                            }
                        >
                            <button
                                className="icon-btn"
                                onClick={() => window.navigator.clipboard.writeText(inviteLink)}
                            >
                                <span className="material-icons">content_copy</span>
                            </button>
                        </OverlayTrigger>
                        <br />
                        Only share this link with people you intend on adding to your team. Team
                        members have editing privileges. This link expires in 24 hours.
                    </p>
                )}
            </Container>
        )
        const mainDisplay = (
            <Col lg={9}>
                <Components.Video title="competition video" src={data.src} />
                <div className={`${styles.markdownContainer} py-3 px-tm-gx`}>
                    <Container fluid className="p-4 bg-lighter">
                        <EditableMarkdown
                            hasWarningMessage={!isDescSaved}
                            onChange={(desc) => {
                                setData({...project, desc})

                                if (isDescSaved) {
                                    setIsDescSaved(false)
                                }
                            }}
                            onSave={onDescSave}
                            onCancel={() => setIsDescSaved(true)}
                            canEdit={isTeamMember}
                        >
                            {project.desc ?? ""}
                        </EditableMarkdown>
                    </Container>
                    {management}
                </div>
            </Col>
        )

        return (
            <>
                <EditModal
                    project={project}
                    shouldShow={shouldShowModal}
                    onClose={() => setShouldShowModal(false)}
                    onSave={(_project) => {
                        setData(_project)
                        writeCache(`talentmakerCache_project-${props.id}`, _project)
                    }}
                />
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
                    desc={`Submission for ${project.competitionName}`}
                >
                    {isTeamMember && (
                        <Button
                            variant="outline-dark"
                            className="mx-2"
                            onClick={() => setShouldShowModal(true)}
                        >
                            <span className="material-icons">settings</span> Edit Details
                        </Button>
                    )}
                </Components.UserInfo>
                <Components.Bar topics={project.topics} />
                <Row>
                    {mainDisplay}
                    <Col lg={3} className="bg-lighter">
                        <Components.Sidebar
                            items={data.items}
                            canEdit={isTeamMember}
                            onSettingsClicked={() => setShouldShowModal(true)}
                        >
                            <h2>Team</h2>
                            <ul>
                                {project.teamMembers.map(
                                    (member): JSX.Element =>
                                        member.isCreator ? (
                                            <li key={member.uid}>
                                                <b>Creator: </b>
                                                {member.username}
                                            </li>
                                        ) : (
                                            <li key={member.uid}>
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
