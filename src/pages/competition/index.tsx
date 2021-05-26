/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {Competition, competitionSchema} from "../../schemas/competition"
import {IFrame, Img} from "../../components/elements"
import {Link, useParams} from "react-router-dom"
import {competitionAdapter, competitionJoinAdapter} from "../../adapters/competition"
import DatePlus from "@luke-zhang-04/dateplus"
import DefaultPFP from "../../images/profile.svg"
import Markdown from "../../components/markdown"
import Prism from "prismjs"
import React from "react"
import {Spinner} from "../../components/bootstrap"
import UserContext from "../../contexts/userContext"
import cache from "../../utils/cache"
import initTooltips from "../../components/bootstrap/tooltip"
import scrollToHeader from "../../components/markdown/scrollToHeader"
import {validate} from "../../utils"

type Props = {
    /**
     * Project id
     */
    id: string
}

type State = {
    competition?: Competition
    hasUser: boolean
    videoDidLoad: boolean
    joining: boolean
}

class CompetitionComponent extends React.Component<Props, State> {
    public constructor(props: Props, context: React.ContextType<typeof UserContext>) {
        super(props)

        this.user = context.currentUser ?? undefined

        this.state = {
            hasUser: this.user !== undefined,
            videoDidLoad: false,
            joining: false,
        }
    }

    public componentDidMount = async (): Promise<void> => {
        this._handleCache()

        const data = await competitionAdapter(this.user, this.props.id)

        if (!(data instanceof Error)) {
            this.setState({competition: data})
        }

        Prism.highlightAll()

        if (window.location.hash) {
            scrollToHeader(window.location.hash)
        }
    }

    public componentDidUpdate = (): void => {
        Prism.highlightAll()

        if (this.state.hasUser === (this.user === undefined)) {
            this.setState({hasUser: this.user !== undefined})
            this.componentDidMount()
        }

        initTooltips()
    }

    private _handleCache = async (): Promise<void> => {
        const data = (await cache.read(`talentmakerCache_competition-${this.props.id}`)) as {
            [key: string]: unknown
        }
        const competition = await validate(competitionSchema, data, false)

        if (competition) {
            this.setState({competition})
        }
    }

    public readonly user?: User

    public static contextType = UserContext

    context!: React.ContextType<typeof UserContext>

    /**
     * Join a competition
     */
    private _join = async (): Promise<void> => {
        this.setState({joining: true})

        const {user} = this

        if (user !== undefined && user !== null) {
            const isSuccessful = !(
                (await competitionJoinAdapter(user, Number(this.props.id))) instanceof Error
            )

            if (isSuccessful) {
                await this.componentDidMount()
            }
        }

        this.setState({joining: false})
    }

    /**
     * Button to join the competition or edit if the user is an organizaton
     */
    private _joinBtn = (): JSX.Element | void => {
        if (
            this.user?.isOrg && // User is organization
            this.state.competition // Competition exists
        ) {
            return this.user.sub === this.state.competition.orgId ? ( // Organization owns competition
                <Link
                    to={`/editCompetition/${this.state.competition.id}`}
                    className="btn btn-outline-dark me-3"
                >
                    <span className="material-icons">create</span> Edit
                </Link>
            ) : undefined
        } else if (!this.state.competition) {
            return undefined
        }

        // User is not an organization
        return this.state.competition?.inComp ? undefined : (
            <button
                className="btn btn-outline-primary btn-lg me-3"
                onClick={this._join}
                disabled={this.state.joining}
            >
                {this.state.joining ? <Spinner inline> </Spinner> : undefined}
                Join
            </button>
        )
    }

    /**
     * Button to create a new submission
     */
    private _submissionBtn = (): JSX.Element => {
        if (this.state.competition?.hasProject) {
            return (
                <div className="d-flex flex-column align-items-center justify-content-end">
                    <Link
                        className="btn btn-outline-dark me-2 mb-2"
                        to={`/editProject?competition=${this.state.competition.id}`}
                    >
                        <span className="material-icons">create</span> Edit Submission
                    </Link>
                    <Link
                        className="btn btn-outline-primary me-2"
                        to={`/project?competition=${this.state.competition.id}`}
                    >
                        <span className="material-icons">visibility</span> View Submission
                    </Link>
                </div>
            )
        } else if (this.state.competition?.inComp) {
            return (
                <Link
                    className="btn btn-outline-primary mx-2"
                    to={`/editProject?competition=${this.state.competition.id}&id=new`}
                >
                    <span className="material-icons">add</span> Create Submission
                </Link>
            )
        }

        return <></>
    }

    /**
     * Banner with organization information
     */
    private _orgInfo = (): JSX.Element => (
        <div className="row">
            <div className="col-lg-2">
                <div className="px-4 my-3">
                    <Img src={DefaultPFP} className="pfp" alt="Profile" />
                </div>
            </div>
            <div className="col-lg-5 d-flex flex-column justify-content-center">
                <p className="username">
                    {this.state.competition?.name ??
                        `${this.state.competition?.orgName || ""}'s Competition`}
                </p>
                <p className="sub text-muted">{this.state.competition?.shortDesc || ""}</p>
            </div>
            <div className="col-lg-5 d-flex flex-row align-items-center justify-content-end">
                {this._submissionBtn()}
                {this.state.competition ? (
                    <Link
                        to={`/projects/${this.state.competition.id}`}
                        className="btn btn-outline-success me-3"
                    >
                        <span className="material-icons">visibility</span> Submissions
                    </Link>
                ) : undefined}
                {this.user === undefined ? (
                    <p className="me-3">
                        <Link to="/auth">Sign up</Link> to participate in competitions.
                    </p>
                ) : (
                    this._joinBtn()
                )}
            </div>
        </div>
    )

    private _compInfo = (competition: Competition, deadline: DatePlus): JSX.Element => {
        const linkProps = {
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-decoration-none mb-3 d-block",
        }

        return (
            <div className="p-3 position-sticky top-0">
                <button
                    className="btn-circle"
                    onClick={(): void => {
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        })
                    }}
                >
                    <span className="material-icons">expand_less</span>
                </button>
                <h1>About</h1>
                <ul className="list-unstyled text-dark">
                    <p>
                        <b>Talentmaker: </b>
                        {competition.orgName}
                        <span className="text-muted">#{competition.orgId.slice(0, 7)}</span>
                    </p>
                    {competition.website ? (
                        <>
                            <a href={competition.website} {...linkProps}>
                                <span className="material-icons">language</span>{" "}
                                {competition.website}
                            </a>
                        </>
                    ) : undefined}
                    <a href={`mailto:${competition.email}`} {...linkProps}>
                        <span className="material-icons">mail</span> {competition.email}
                    </a>
                    <span className="material-icons">event</span> {deadline.getWordMonth()}{" "}
                    {deadline.getDate()}, {deadline.getFullYear()}@
                    {deadline.getHours() < 10 ? `0${deadline.getHours()}` : deadline.getHours()}:
                    {deadline.getMinutes()}
                </ul>
            </div>
        )
    }

    /**
     * Sidebar with competition information
     */
    private _sidebar = (): JSX.Element => {
        const {competition} = this.state

        if (!competition) {
            return <></>
        }

        const deadline = new DatePlus(competition.deadline)

        deadline.setMinutes(
            // Offset from UTC Time
            deadline.getMinutes() - deadline.getTimezoneOffset(),
        )

        return this._compInfo(competition, deadline)
    }

    /**
     * Render markdown description
     */
    private _renderDescription = (): JSX.Element => (
        <div className="markdown-container p-3">
            <div className="container-fluid p-4 bg-lighter">
                <Markdown>{this.state.competition?.desc ?? "# No description provided"}</Markdown>
            </div>
        </div>
    )

    /**
     * Get embeded video source
     */
    private _getSrc = (): string =>
        this.state.competition?.videoURL
            ?.replace("watch?v=", "embed/")
            .replace("https://youtu.be", "https://www.youtube.com/embed") ?? ""

    protected content = (): JSX.Element => (
        <>
            {this._orgInfo()}
            <div className="row bg-primary bar">
                <div className="col-sm-12 topics">
                    {" "}
                    {/* Blue bar with competitions */}
                    {this.state.competition?.topics?.map(
                        (topic, index): JSX.Element => (
                            <p
                                className="bg-primary mx-1 my-0 py-1 px-2 d-flex"
                                key={`topic-${topic}-${index}`}
                            >
                                {topic}
                            </p>
                        ),
                    )}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-9">
                    {this.state.competition?.videoURL ? ( // Video
                        <div className="mx-3 mt-3">
                            <div
                                className={`video-container ${
                                    this.state.videoDidLoad ? "" : "p-0"
                                }`}
                            >
                                <IFrame
                                    title="competition video"
                                    className="video"
                                    src={this._getSrc()}
                                    onLoad={(): void => this.setState({videoDidLoad: true})} // Change state to add padding
                                    onError={(): void => this.setState({videoDidLoad: true})}
                                >
                                    <Spinner
                                        color="danger"
                                        size="25vw"
                                        className="my-5"
                                        centered
                                    />
                                </IFrame>
                            </div>
                        </div>
                    ) : undefined}
                    {this._renderDescription()}
                </div>
                <div className="col-lg-3 bg-lighter">{this._sidebar()}</div>
            </div>
        </>
    )

    public render = (): JSX.Element =>
        this.state.competition ? (
            this.content()
        ) : (
            <Spinner color="primary" size="25vw" className="my-5" centered />
        )
}

export const CompetitionWrapper = (): JSX.Element => {
    const {id} = useParams<{id?: string}>()

    return id ? (
        <CompetitionComponent id={id} />
    ) : (
        <>
            <h1>Error:</h1>
            <p>No competition ID specified</p>
        </>
    )
}

export default CompetitionWrapper
