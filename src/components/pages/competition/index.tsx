/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import * as Components from "../../detailedItem"
import {Competition as CompetitionType, competitionSchema} from "../../../schemas/competition"
import {JoinButton, SubmissionButton} from "./buttons"
import {Spinner, initTooltips} from "../../bootstrap"
import DatePlus from "@luke-zhang-04/dateplus"
import {Link} from "react-router-dom"
import Markdown from "../../markdown"
import Prism from "prismjs"
import React from "react"
import UserContext from "../../../contexts/userContext"
import cache from "../../../utils/cache"
import competitionAdapter from "../../../adapters/competition"
import scrollToHeader from "../../../components/markdown/scrollToHeader"
import {validate} from "../../../utils"

type Props = {
    /**
     * Project id
     */
    id: string
}

type Data = {
    src: string
    deadline: DatePlus
    items: React.ComponentProps<typeof Components.Sidebar>["items"]
}

export const Competition: React.FC<Props> = (props) => {
    const [competition, setCompetition] = React.useState<CompetitionType | undefined>()
    const {currentUser: user} = React.useContext(UserContext)

    const setup = React.useCallback(() => {
        ;(async () => {
            const data = await cache.read(`talentmakerCache_competition-${props.id}`)

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
    }, [])

    React.useEffect(() => {
        Prism.highlightAll()

        initTooltips()
    })

    const getData = React.useCallback((_competition: CompetitionType): Data => {
        const deadline = new DatePlus(_competition.deadline)

        deadline.setMinutes(
            // Offset from UTC Time
            deadline.getMinutes() - deadline.getTimezoneOffset(),
        )

        return {
            items: [
                {
                    title: "Talentmaker: ",
                    contents: (
                        <>
                            {" "}
                            {_competition.orgName}
                            <span className="text-muted">#{_competition.orgId.slice(0, 7)}</span>
                        </>
                    ),
                },
                _competition.website
                    ? {
                          icon: "language",
                          contents: _competition.website,
                          href: _competition.website,
                      }
                    : undefined,
                {
                    icon: "mail",
                    contents: _competition.email,
                    href: `mailto:${_competition.email}`,
                },
                {
                    icon: "event",
                    contents: `${deadline.getWordMonth()} ${deadline.getDate()}, ${deadline.getFullYear()}@${
                        deadline.getHours() < 10 ? `0${deadline.getHours()}` : deadline.getHours()
                    }:${deadline.getMinutes()}`,
                },
            ],
            src:
                _competition.videoURL
                    ?.replace("watch?v=", "embed/")
                    .replace("https://youtu.be", "https://www.youtube.com/embed") ?? "",
            deadline,
        }
    }, [])

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
                <div className="row bg-primary bar">
                    <div className="col-sm-12 topics">
                        {" "}
                        {/* Blue bar with competitions */}
                        {competition?.topics?.map((topic, index) => (
                            <p
                                className="bg-primary mx-1 my-0 py-1 px-2 d-flex"
                                key={`topic-${topic}-${index}`}
                            >
                                {topic}
                            </p>
                        ))}
                    </div>
                </div>
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
