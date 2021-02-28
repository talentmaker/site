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
import DefaultPFP from "../images/profile.svg"
import Markdown from "../markdown"
import React from "react"
import {Spinner} from "../bootstrap"
import UserContext from "../userContext"
import osiLicenses from "osi-licenses"
import queryString from "query-string"
import spdxLicenses from "spdx-license-ids"

class ProjectComponent extends BaseComponent {

    private _videoRef = React.createRef<HTMLDivElement>()

    /**
     * With a license, return a either a link to a unknown licnese, link to
     * license, or just the text
     */
    private static _projectLicense = (license: string): JSX.Element | string => {
        if (license in osiLicenses) {
            return <a
                href={`https://opensource.org/licenses/${license}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none mb-3 d-block"
            ><span className="material-icons">gavel</span> {osiLicenses[license]}</a>
        } else if (spdxLicenses.includes(license)) {
            return <a
                href={`https://spdx.org/licenses/${license}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none mb-3 d-block"
            ><span className="material-icons">gavel</span> {license}</a>
        } else if ((/^http/u).test(license)) {
            return <a
                href={license}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none mb-3 d-block"
            ><span className="material-icons">gavel</span> {license}</a>
        }

        return <>
            <span className="material-icons">gavel</span>{" "}
            {license}
        </>
    }

    /**
     * The edit button
     */
    private _editBtn = (): JSX.Element => <Link
        className="btn btn-outline-dark mx-0 mx-lg-3"
        to={`/editProject/${this.state.project?.id ?? ""}`}
    ><span className="material-icons">create</span> Edit Submission</Link>

    /**
     * Display the user's info
     */
    private _userInfo = (): JSX.Element => <div className="row p-3 p-lg-0">
        <div className="col-12 col-lg-2">
            <div className="px-lg-4 my-lg-3 d-flex flex-row align-items-center">
                <Img src={DefaultPFP} className="pfp" alt="Profile"/>
                <p className="d-lg-none my-0 ms-1">
                    {this.state.project?.creatorUsername || ""}
                </p>
            </div>
        </div>
        <div className="col-lg-5 d-flex flex-column justify-content-center pt-3 pt-lg-0">
            <p className="username">
                {this.state.project?.name ?? "Submission"}
            </p>
            <p className="sub text-muted">
                Submission for {this.state.project?.name ?? "Submission"}
            </p>
        </div>
        <div className="col-lg-5 d-flex flex-row align-items-center justify-content-start justify-content-lg-end">
            {
                (this.props.user?.sub ?? "") === this.state.project?.creator
                    ? this._editBtn()
                    : undefined
            }
        </div>
    </div>

    /**
     * Disaply the urls for the project sidebar
     */
    private _projectURLs = (
        project: import("./baseComponent").Project,
    ): JSX.Element => {
        const linkProps = {
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-decoration-none mb-3 d-block",
        }

        return <>
            {
                project?.srcURL
                    ? <a href={project.srcURL} {...linkProps}>
                        <span className="material-icons">code</span> {project.srcURL}
                    </a>
                    : undefined
            }
            {
                project?.demoURL
                    ? <a href={project.demoURL} {...linkProps}>
                        <span className="material-icons">preview</span> {project.demoURL}
                    </a>
                    : undefined
            }
            {
                project?.videoURL
                    ? <a href={project.videoURL} {...linkProps}>
                        <span className="material-icons">video_library</span> {project.videoURL}
                    </a>
                    : undefined
            }
            {
                project?.license
                    ? ProjectComponent._projectLicense(project.license)
                    : undefined
            }
        </>
    }

    /**
     * The sidebar with the project info
     */
    private _sidebar = (): JSX.Element => {
        const {project} = this.state

        if (project) {
            return <div className="p-3 position-sticky top-0">
                <button
                    className="btn-circle  d-none d-lg-block"
                    onClick={(): void => {
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        })
                    }}
                ><span className="material-icons">expand_less</span></button>
                <h1>About</h1>
                <ul className="list-unstyled text-dark">
                    <p>
                        <b>Competition: </b>
                        <Link to={`/competition/${project.competitionId}`}>
                            {project.competitionName}
                        </Link>
                    </p>
                    <p>
                        <span className="material-icons">account_circle</span>{" "}
                        {project.creatorUsername}
                    </p>
                    {this._projectURLs(project)}
                </ul>
                <button
                    className="btn-circle d-block d-lg-none"
                    onClick={(): void => this._videoRef.current?.scrollIntoView(true)}
                ><span className="material-icons">expand_more</span></button>
            </div>
        }

        return <></>
    }

    /**
     * Render markdown description
     */
    private _renderDescription = (): JSX.Element => (
        <div className="markdown-container p-3">
            <div className="container-fluid p-4 bg-lighter">
                <Markdown>
                    {this.state.project?.desc ?? "# No description provided"}
                </Markdown>
            </div>
        </div>
    )

    /**
     * Get embeded video source
     */
    private _getSrc = (): string => this.state.project?.videoURL
        ?.replace("watch?v=", "embed/")
        .replace("https://youtu.be", "https://www.youtube.com/embed") ?? ""

    protected content = (): JSX.Element => <>
        {this._userInfo()}
        <div className="row topics bg-primary d-flex align-items-center bar">
            <div className="col-sm-12 topics-container mx-auto"> {/* Blue bar with topics */}
                {this.state.project?.topics?.map((topic, index): JSX.Element => (
                    <p
                        className="bg-primary mx-1 my-0 py-1 px-2"
                        key={`topic-${topic}-${index}`}
                    >{topic}</p>
                ))}
            </div>
        </div>
        <div className="row flex-column-reverse flex-lg-row">
            <div className="col-lg-9">
                {
                    this.state.project?.videoURL
                        ? <div className="mx-3 mt-3">
                            <div
                                className={`video-container ${this.state.videodidLoad ? "" : "p-0"}`}
                                ref={this._videoRef}
                            >
                                <IFrame
                                    title="project video"
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
            <div className="col-lg-3 bg-lighter">{this._sidebar()}</div>
        </div>
    </>

    public render = (): JSX.Element => (
        this.state.project
            ? this.content()
            : <Spinner color="primary" size="25vw" className="my-5" centered/>
    )

}

export const Project = (): JSX.Element => {
    const {id} = useParams<{id?: string}>()
    const {competition: compId} = queryString.parse(window.location.search)

    if (id) {
        return <UserContext.Consumer>
            {({currentUser: user}): JSX.Element => <ProjectComponent
                id={id}
                user={user ?? undefined}
            />}
        </UserContext.Consumer>
    } else if (typeof compId === "string") {
        return <UserContext.Consumer>
            {({currentUser: user}): JSX.Element => (
                user
                    ? <ProjectComponent
                        compId={compId}
                        user={user ?? undefined}
                    />
                    : <Spinner color="primary" size="25vw" className="my-5" centered/>
            )}
        </UserContext.Consumer>
    }

    return <>
        <h1>Error:</h1>
        <p>No Project ID specified</p>
    </>
}

export default Project
