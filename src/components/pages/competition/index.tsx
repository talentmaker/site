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
import {Link} from "react-router-dom"
import Markdown from "~/components/markdown"
import Prism from "prismjs"
import React from "react"
import UserContext from "~/contexts/userContext"
import competitionAdapter from "~/adapters/competition"
import {competitionSchema} from "~/schemas/competition"
import getCompetitionData from "./utils"
import {readCache} from "~/utils"
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
    const {data: competition, rerun} = useAdapter(
        () => competitionAdapter(user?.uid, props.id),
        async () =>
            competitionSchema.validate(
                await readCache(`talentmakerCache_competition-${props.id}`),
            ),
        [user],
    )

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

        return (
            <>
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
                    {competition ? (
                        <Button
                            variant="outline-success"
                            as={Link}
                            to={`/projects/${competition.id}`}
                            className="me-3"
                        >
                            <span className="material-icons">visibility</span> Submissions
                        </Button>
                    ) : undefined}
                    {user === undefined ? (
                        <p className="me-3">
                            <Link to="/auth">Sign up</Link> to participate in competitions.
                        </p>
                    ) : (
                        <JoinButton {...{user, competition}} onSuccess={rerun} />
                    )}
                </Components.UserInfo>
                <Components.Bar topics={competition?.topics} />
                <Row>
                    <Col lg={9}>
                        <Components.Video title="competition video" src={data.src} />
                        <div className={`${styles.markdownContainer} py-3 px-gx`}>
                            <Container fluid className="p-4 bg-lighter">
                                <Markdown>
                                    {competition.desc ?? "# No description provided"}
                                </Markdown>
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

export default Competition
