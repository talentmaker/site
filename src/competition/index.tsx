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

import {Link, useParams} from "react-router-dom"
import BaseComponent from "./baseComponent"
import DatePlus from "@luke-zhang-04/dateplus"
import DefaultPFP from "../images/profile.svg"
import Markdown from "../markdown"
import React from "react"
import UserContext from "../userContext"
import join from "./join"

class CompetitionComponent extends BaseComponent {

    /**
     * Join a competition
     */
    private _join = async (): Promise<void> => {
        const {user, id} = this.props

        if (user !== undefined && user !== null) {
            const issuccessful = await join(user, Number(id))

            if (issuccessful) {
                await this.componentDidMount()
            }
        }
    }

    /**
     * Button to join the competition
     */
    private _joinBtn = (): JSX.Element => (
        this.state.competition?.inComp
            ? <div className="border border-1 border-success text-success p-2 mr-3">
                <span className="material-icons">done</span> Joined
            </div>
            : <button
                className="btn btn-outline-primary btn-lg mr-3"
                onClick={this._join}
            >Join</button>
    )

    /**
     * Button to create a new submission
     */
    private _submissionBtn = (): JSX.Element => (
        this.state.competition?.inComp
            ? <Link
                className="btn btn-outline-primary mx-2"
                to={`editProject/${this.state.competition.id}`}
            >Create Submission</Link>
            : <></>
    )

    /**
     * Banner with organization information
     */
    private _orgInfo = (): JSX.Element => <div className="row">
        <div className="col-lg-2">
            <div className="px-4 my-3">
                <img src={DefaultPFP} className="pfp" alt="Profile"/>
            </div>
        </div>
        <div className="col-lg-6 d-flex flex-column justify-content-center">
            <p className="username">
                {this.state.competition?.name ?? `${this.state.competition?.orgName || ""}'s Competition`}
            </p>
            <p className="sub text-muted">
                {this.state.competition?.shortDesc || ""}
            </p>
        </div>
        <div className="col-lg-4 d-flex flex-row align-items-center justify-content-end">
            <this._submissionBtn/>
            {
                this.props.user === undefined
                    ? <p className="mr-3"><Link to="auth">Sign up</Link> to participate in competitions.</p>
                    : <this._joinBtn/>
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

            return <div className="col-lg-3 bg-darker">
                <div className="container">
                    <h1>About</h1>
                    <ul className="list-unstyled text-light">
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
            <div className="container py-2 bg-darker">
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

    public render = (): JSX.Element => <>
        <this._orgInfo/>
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
            <this._compInfo/>
            <div className="col-lg-9">
                {
                    this.state.competition?.videoURL
                        ? <div className="mx-3 mt-3">
                            <div className="video-container">
                                <iframe
                                    title="competition video"
                                    className="video"
                                    src={this._getSrc()}
                                ></iframe>
                            </div>
                        </div>
                        : <></>
                }
                {this._renderDescription()}
            </div>
        </div>
    </>

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
