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
import {Breadcrumb, Button, Col, Container, Row} from "react-bootstrap"
import {JoinButton, SubmissionButton} from "./buttons"
import {readCache, writeCache} from "~/utils"
import EditModal from "./editModal"
import {EditableMarkdown} from "~/components/markdown"
import {Link} from "react-router-dom"
import MaterialIcons from "~/components/materialIcons"
import MetaTags from "~/components/metaTags"
import NotificationContext from "~/contexts/notificationContext"
import Prism from "prismjs"
import React from "react"
import {Spinner} from "~/components/bootstrap"
import UserContext from "~/contexts/userContext"
import {competitionSchema} from "~/schemas/competition"
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
        isLoadingApi,
    } = useAdapter(
        () => adapters.competition.get(user?.uid, props.id),
        () => competitionSchema.validate(readCache(`talentmakerCache_competition-${props.id}`)),
        [user?.uid],
    )
    const [shouldShowModal, setShouldShowModal] = React.useState(false)
    const [isDescSaved, setIsDescSaved] = React.useState(true)
    const {addNotification: notify} = React.useContext(NotificationContext)

    React.useEffect(() => {
        if (window.location.hash) {
            scrollToHeader(window.location.hash)
        }
    }, [competition?.id, isLoadingApi])

    React.useEffect(() => {
        Prism.highlightAll()
    })

    if (competition) {
        const data = getCompetitionData(competition)
        const isOwner = user !== undefined && user.uid === competition.organizationId
        const onDescSave = isOwner // Why
            ? async (desc: string): Promise<void> => {
                  if (user && competition) {
                      setData({...competition, desc})

                      const result = await adapters.competition.update(user, {
                          desc,
                          id: competition.id,
                      })

                      if (!(result instanceof Error)) {
                          writeCache(`talentmakerCache_competition-${props.id}`, competition)

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
                <div className={`${styles.markdownContainer} py-3 px-tm-gx`}>
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
                    <MaterialIcons icon="settings" /> Edit Details
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
                    onSave={(_competition) => {
                        setData(_competition)
                        writeCache(`talentmakerCache_competition-${props.id}`, _competition)
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
                        to={`/projects/${competition.id}`}
                        className="me-3"
                    >
                        <MaterialIcons icon="visibility" /> Submissions
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
                <MetaTags
                    title={competition.name ?? `${competition.orgName}'s Competition`}
                    description={competition.shortDesc}
                    image={competition.coverImageURL}
                />
            </>
        )
    }

    return <Spinner color="primary" size="25vw" className="my-5" centered />
}

export default Competition
