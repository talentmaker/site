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
import {Competition as CompetitionType, competitionSchema} from "~/schemas/competition"
import {JoinButton, SubmissionButton} from "./buttons"
import {Spinner, initTooltips} from "~/components/bootstrap"
import {readCache, validate} from "~/utils"
import {Link} from "react-router-dom"
import Markdown from "~/components/markdown"
import Prism from "prismjs"
import React from "react"
import UserContext from "~/contexts/userContext"
import competitionAdapter from "~/adapters/competition"
import getCompetitionData from "./utils"
import scrollToHeader from "~/components/markdown/scrollToHeader"

type Props = {
    /**
     * Project id
     */
    id: string
}

export const Competition: React.FC<Props> = (props) => {
    const [competition, setCompetition] = React.useState<CompetitionType | undefined>()
    const {currentUser: user} = React.useContext(UserContext)

    const setup = React.useCallback(() => {
        ;(async () => {
            const data = await readCache(`talentmakerCache_competition-${props.id}`)

            setCompetition(await validate(competitionSchema, data, false))
        })()
        ;(async () => {
            const data = await competitionAdapter(user, props.id)

            if (!(data instanceof Error)) {
                setCompetition(data)
            }
        })()
    }, [props.id, user])

    React.useEffect(() => {
        setup()

        if (window.location.hash) {
            scrollToHeader(window.location.hash)
        }
    }, [props.id, user])

    React.useEffect(() => {
        Prism.highlightAll()

        initTooltips()
    })

    const getData = React.useCallback(getCompetitionData, [])

    if (competition) {
        const data = getData(competition)

        return (
            <>
                <Components.UserInfo
                    username={competition.name ?? `${competition.orgName}'s Competition`}
                    desc={competition.shortDesc}
                >
                    <SubmissionButton competition={competition} />
                    {competition ? (
                        <Link
                            to={`/projects/${competition.id}`}
                            className="btn btn-outline-success me-3"
                        >
                            <span className="material-icons">visibility</span> Submissions
                        </Link>
                    ) : undefined}
                    {user === undefined ? (
                        <p className="me-3">
                            <Link to="/auth">Sign up</Link> to participate in competitions.
                        </p>
                    ) : (
                        <JoinButton {...{user, competition}} onSuccess={setup} />
                    )}
                </Components.UserInfo>
                <Components.Bar topics={competition?.topics} />
                <div className="row">
                    <div className="col-lg-9">
                        <Components.Video title="competition video" src={data.src} />
                        <div className="markdown-container p-3">
                            <div className="container-fluid p-4 bg-lighter">
                                <Markdown>
                                    {competition.desc ?? "# No description provided"}
                                </Markdown>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 bg-lighter">
                        <Components.Sidebar items={data.items} />
                    </div>
                </div>
            </>
        )
    }

    return <Spinner color="primary" size="25vw" className="my-5" centered />
}

export default Competition
