/**
 * Talentmaker website
 *
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 */

import {IFrame, Img} from "../elements"
import {Link, useParams} from "react-router-dom"
import BaseComponent from "./baseComponent"
import DatePlus from "@luke-zhang-04/dateplus"
import DefaultPFP from "../images/profile.svg"
import Markdown from "../markdown"
import React from "react"
import {Spinner} from "../bootstrap"
import UserContext from "../userContext"
import join from "./join"

class CompetitionComponent extends BaseComponent {

    /**
     * Join a competition
     */
    private _join = async (): Promise<void> => {
        const {user, id} = this.props

        if (user !== undefined && user !== null) {
            const isSuccessful = await join(user, Number(id))

            if (isSuccessful) {
                await this.componentDidMount()
            }
        }
    }

    /**
     * Button to join the competition or edit if the user is an organizaton
     */
    private _joinBtn = (): JSX.Element | void => {
        if (
            this.props.user?.isOrg && // User is organization
            this.state.competition // Competition exists
        ) {
            return this.props.user.sub === this.state.competition.orgId // Organization owns competition
                ? <Link
                    to={`/editCompetition/${this.state.competition.id}`}
                    className="btn btn-outline-dark mr-3"
                ><span className="material-icons">create</span> Edit</Link>
                : undefined
        } else if (!this.state.competition) {
            return undefined
        }

        // User is not an organization
        return this.state.competition?.inComp
            ? undefined
            : <button
                className="btn btn-outline-primary btn-lg mr-3"
                onClick={this._join}
            >Join</button>
    }

    /**
     * Button to create a new submission
     */
    private _submissionBtn = (): JSX.Element => {
        if (this.state.competition?.hasProject) {
            return <div className="d-flex flex-column align-items-center justify-content-end">
                <Link
                    className="btn btn-outline-dark mr-2 mb-2"
                    to={`/editProject?competition=${this.state.competition.id}`}
                ><span className="material-icons">create</span> Edit Submission</Link>
                <Link
                    className="btn btn-outline-primary mr-2"
                    to={`/project?competition=${this.state.competition.id}`}
                ><span className="material-icons">visibility</span> View Submission</Link>
            </div>
        } else if (this.state.competition?.inComp) {
            return <Link
                className="btn btn-outline-primary mx-2"
                to={`/editProject?competition=${this.state.competition.id}`}
            ><span className="material-icons">add</span> Create Submission</Link>
        }

        return <></>
    }

    /**
     * Banner with organization information
     */
    private _orgInfo = (): JSX.Element => <div className="row">
        <div className="col-lg-2">
            <div className="px-4 my-3">
                <Img src={DefaultPFP} className="pfp" alt="Profile"/>
            </div>
        </div>
        <div className="col-lg-5 d-flex flex-column justify-content-center">
            <p className="username">
                {this.state.competition?.name ?? `${this.state.competition?.orgName || ""}'s Competition`}
            </p>
            <p className="sub text-muted">
                {this.state.competition?.shortDesc || ""}
            </p>
        </div>
        <div className="col-lg-5 d-flex flex-row align-items-center justify-content-end">
            {this._submissionBtn()}
            {
                this.state.competition
                    ? <Link
                        to={`/projects/${this.state.competition.id}`}
                        className="btn btn-outline-success mr-3"
                    ><span className="material-icons">visibility</span> Submissions</Link>
                    : undefined
            }
            {
                this.props.user === undefined
                    ? <p className="mr-3"><Link to="/auth">Sign up</Link> to participate in competitions.</p>
                    : this._joinBtn()
            }
        </div>
    </div>

    /**
     * Sidebar with competition information
     */
    private _compInfo = (): JSX.Element => {
        const {competition} = this.state

        if (competition) {
            const deadline = new DatePlus(competition.deadline)

            deadline.setMinutes( // Offset from UTC Time
                deadline.getMinutes() - deadline.getTimezoneOffset(),
            )

            return <div className="col-lg-3 bg-lighter">
                <div className="container">
                    <h1>About</h1>
                    <ul className="list-unstyled text-dark">
                        <p>
                            <b>Deadline: </b>
                            {deadline.getWordMonth()} {deadline.getDate()}, {deadline.getFullYear()}
                            @{deadline.getHours() < 10 ? `0${deadline.getHours()}` : deadline.getHours()}:{deadline.getMinutes()}
                        </p>
                        <p>
                            <b>Company: </b>
                            {competition.orgName}<span className="text-muted">#{competition.orgId.slice(0, 7)}</span>
                        </p>
                        <p>
                            <b>Company website: </b>{
                                competition.website
                                    ? <a href={competition.website} target="_blank" rel="noopener noreferrer">{
                                        competition.website
                                    }</a>
                                    : "None"
                            }
                        </p>
                        <p>
                            <b>Company email: </b>
                            <a href={`mailto:${competition.email}`} target="_blank" rel="noopener noreferrer">
                                {competition.email}
                            </a>
                        </p>
                    </ul>
                </div>
            </div>
        }

        return <></>
    }

    /**
     * Render markdown description
     */
    private _renderDescription = (): JSX.Element => (
        <div className="markdown-container p-3">
            <div className="container p-4 bg-lighter">
                <Markdown>
                    {this.state.competition?.desc ?? "# No description provided"}
                </Markdown>
            </div>
        </div>
    )

    /**
     * Get embeded video source
     */
    private _getSrc = (): string => this.state.competition?.videoURL
        ?.replace("watch?v=", "embed/")
        .replace("https://youtu.be", "https://www.youtube.com/embed") ?? ""

    protected content = (): JSX.Element => <>
        {this._orgInfo()}
        <div className="row bg-primary bar">
            <div className="col-sm-12 topics"> {/* Blue bar with competitions */}
                {this.state.competition?.topics.map((topic, index): JSX.Element => (
                    <p
                        className="bg-primary mx-1 my-0 py-1 px-2 d-flex"
                        key={`topic-${topic}-${index}`}
                    >{topic}</p>
                ))}
            </div>
        </div>
        <div className="row">
            {this._compInfo()}
            <div className="col-lg-9">
                {
                    this.state.competition?.videoURL // Video
                        ? <div className="mx-3 mt-3">
                            <div className={`video-container ${this.state.videodidLoad ? "" : "p-0"}`}>
                                <IFrame
                                    title="competition video"
                                    className="video"
                                    src={this._getSrc()}
                                    onLoad={(): void => this.setState({videodidLoad: true})} // Change state to add padding
                                    onError={(): void => this.setState({videodidLoad: true})}
                                >
                                    <Spinner color="danger" size="25vw" className="my-5" centered/>
                                </IFrame>
                            </div>
                        </div>
                        : undefined
                }
                {this._renderDescription()}
            </div>
        </div>
    </>

    public render = (): JSX.Element => (
        this.state.competition
            ? this.content()
            : <Spinner color="primary" size="25vw" className="my-5" centered/>
    )

}

export const Competition = (): JSX.Element => {
    const {id} = useParams<{id?: string}>()

    if (id) {
        return <UserContext.Consumer>
            {({currentUser: user}): JSX.Element => <CompetitionComponent
                id={id}
                user={user ?? undefined}
            />}
        </UserContext.Consumer>
    }

    return <>
        <h1>Error:</h1>
        <p>No competition ID specified</p>
    </>
}

export default Competition
