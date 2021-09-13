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
import {JoinButton, SubmissionButton} from "./buttons"
import {Spinner, initTooltips} from "~/components/bootstrap"
import {readCache, writeCache} from "~/utils"
import EditModal from "./editModal"
import {EditableMarkdown} from "~/components/markdown"
import {Link} from "react-router-dom"
import NotificationContext from "~/contexts/notificationContext"
import Prism from "prismjs"
import React from "react"
import UserContext from "~/contexts/userContext"
import competitionAdapter from "~/adapters/competition"
import {competitionSchema} from "~/schemas/competition"
import editCompetitionAdapter from "~/adapters/editCompetition"
import getCompetitionData from "./utils"
import scrollToHeader from "~/components/markdown/scrollToHeader"
import styles from "~/components/markdown/styles.module.scss"
import {useAdapter} from "~/hooks"

type Props = {
    /**
     * Project id
     */
    id: string
}

export const Competition: React.FC<Props> = (props) => {
    const {currentUser: user} = React.useContext(UserContext)
    const {
        data: competition,
        rerun,
        setData,
    } = useAdapter(
        () => competitionAdapter(user?.uid, props.id),
        async () =>
            competitionSchema.validate(
                await readCache(`talentmakerCache_competition-${props.id}`),
            ),
        [user],
    )
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

        initTooltips()
    })

    const getData = React.useCallback(getCompetitionData, [])

    if (competition) {
        const data = getData(competition)
        const isOwner = user !== undefined && user.uid === competition.organizationId
        const onDescSave = isOwner // Why
            ? async (desc: string): Promise<void> => {
                  if (user && competition) {
                      setData({...competition, desc})

                      const result = await editCompetitionAdapter(user, {
                          desc,
                          id: competition.id,
                      })

                      if (!(result instanceof Error)) {
                          await writeCache(`talentmakerCache_competition-${props.id}`, competition)

                          setIsDescSaved(true)

                          notify({
                              title: "Success!",
                              content: "Successfully edited your competition!",
                              icon: "done_all",
                              iconClassName: "text-success",
                          })
                      }
                  }
              }
            : undefined
        const mainDisplay = (
            <Col lg={9}>
                <Components.Video title="competition video" src={data.src} />
                <div className={`${styles.markdownContainer} py-3 px-gx`}>
                    <Container fluid className="p-4 bg-lighter">
                        <EditableMarkdown
                            hasWarningMessage={!isDescSaved}
                            onChange={(desc) => {
                                setData({...competition, desc})

                                if (isDescSaved) {
                                    setIsDescSaved(false)
                                }
                            }}
                            onSave={onDescSave}
                            onCancel={() => setIsDescSaved(true)}
                            canEdit={isOwner}
                        >
                            {competition.desc ?? ""}
                        </EditableMarkdown>
                    </Container>
                </div>
            </Col>
        )
        let joinButton: JSX.Element

        if (user === undefined) {
            joinButton = (
                <p className="me-3">
                    <Link to="/auth">Sign up</Link> to participate in competitions.
                </p>
            )
        } else if (isOwner) {
            joinButton = (
                <Button
                    variant="outline-dark"
                    className="mx-2"
                    onClick={() => setShouldShowModal(true)}
                >
                    <span className="material-icons">settings</span> Edit Details
                </Button>
            )
        } else {
            joinButton = <JoinButton {...{user, competition}} onSuccess={rerun} />
        }

        return (
            <>
                <EditModal
                    competition={competition}
                    shouldShow={shouldShowModal}
                    onClose={() => setShouldShowModal(false)}
                    onSave={async (_competition) => {
                        setData(_competition)
                        await writeCache(`talentmakerCache_competition-${props.id}`, _competition)
                    }}
                />
                <Breadcrumb className="container-fluid" listProps={{className: "mb-0"}}>
                    <Breadcrumb.Item linkAs={Link} linkProps={{to: "/competitions"}}>
                        Competitions
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>{props.id}</Breadcrumb.Item>
                </Breadcrumb>
                <Components.UserInfo
                    username={competition.name ?? `${competition.orgName}'s Competition`}
                    desc={competition.shortDesc}
                >
                    <SubmissionButton competition={competition} />
                    <Button
                        variant="outline-success"
                        as={Link}
                        to={`/competitions/${competition.id}`}
                        className="me-3"
                    >
                        <span className="material-icons">visibility</span> Submissions
                    </Button>
                    {joinButton}
                </Components.UserInfo>
                <Components.Bar topics={competition?.topics} />
                <Row>
                    {mainDisplay}
                    <Col lg={3} className="bg-lighter">
                        <Components.Sidebar items={data.items} />
                    </Col>
                </Row>
            </>
        )
    }

    return <Spinner color="primary" size="25vw" className="my-5" centered />
}

export default Competition
