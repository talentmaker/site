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

import "./index.scss"
import {Link, useParams} from "react-router-dom"
import {Project, isProject} from "../project/baseComponent"
import type {CognitoUser} from "../utils/cognito"
import DefaultPhoto from "../images/default.svg"
import {Img} from "../elements"
import React from "react"
import {Spinner} from "../bootstrap"
import UserContext from "../userContext"
import {arrayToChunks} from "../utils/misc"
import cache from "../cache"
import handleError from "../errorHandler"
import notify from "../notify"
import {url} from "../globals"

const isProjects = (
    obj: unknown,
): obj is Project[] => (
    obj instanceof Array &&
    (obj.length === 0 || isProject(obj[0]))
)

interface State {
    projects?: Project[],
}

interface Props {
    user?: CognitoUser,
    compId: string,
}

class ProjectsComponent extends React.Component<Props, State> {

    public constructor (props: Props) {
        super(props)

        this.state = {
            projects: undefined,
        }
    }

    public componentDidMount = async (): Promise<void> => {
        try {
            this._handleCache()

            const data = await (await fetch(
                `${url}/projects/get?column=competitionId&value=${this.props.compId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )).json() as {[key: string]: unknown}

            if (!isProjects(data)) { // Check the fetched data
                notify({
                    title: "Error",
                    icon: "report_problem",
                    iconClassName: "text-danger",
                    content: `Data from server did not match the pre-determined structure`,
                })
                console.error(`${data} is not of type Project`)

                return
            }

            this.setState({projects: data})

            cache.write(
                "talentmakerCache_projects",
                data.map((project) => ({
                    ...project,
                    desc: undefined, // Remove descriptions; They're long and aren't used in this context
                })),
            )
        } catch (err: unknown) {
            handleError(err)
        }
    }

    public componentDidUpdate = async (): Promise<void> => {
        (await import("../bootstrap/tooltip")).initTooltips()
    }

    private _handleCache = async (): Promise<void> => {
        const data = await cache.read(
            "talentmakerCache_projects",
        ) as {[key: string]: unknown}

        if (isProjects(data)) {
            this.setState({projects: data})
        }
    }

    /**
     * Sort projects into "chunks"
     */
    private _getSortedComponents = (): Project[][][] => {

        // Projects due in the future and past
        const advancing: Project[] = [],
            submitted = this.state.projects ?? []

        return [arrayToChunks(advancing), arrayToChunks(submitted)]
    }

    private _project = (project: Project, index: number): JSX.Element => (
        <div key={`comp-col-${index}-${project.id}`} className="col-lg-4 my-3">
            <div className="project-card">
                <Img src={project.coverImageURL ?? DefaultPhoto} alt="cover">
                    <Spinner color="primary" size="6rem" centered/>
                </Img>
                <div className="project-info">
                    <div className="container project-details">
                        <h3>{project.name}</h3>
                        <Link
                            to={`/project/${project.id}`}
                            className="btn btn-outline-primary"
                        >Details</Link>
                        { // This project belongs to this user
                            this.props.user?.sub === project.creator
                                ? <Link
                                    to={`/editProject/${project.id}`}
                                    className="btn btn-outline-dark d-inline-block float-right"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="left"
                                    title="Edit"
                                ><span className="material-icons">create</span></Link>
                                : undefined
                        }
                    </div>
                </div>
            </div>
        </div>
    )

    private _projects = (): JSX.Element => {
        const projects = this._getSortedComponents()

        return <>
            <h1>Advancing</h1>
            {
                (projects[0]?.length ?? 0) > 0
                    ? projects[0].map((row, index) => (
                        <div key={`project-row-${index}`} className="row">
                            {row.map((project) => this._project(project, index))}
                        </div>
                    ))
                    : <p>None</p>
            }

            <h1>Submitted</h1>
            {projects[1]?.map((row, index) => <div key={`project-row-${index}`} className="row">
                {row.map((project) => this._project(project, index))}
            </div>)}
        </>
    }

    public render = (): JSX.Element => (
        this.state.projects
            ? <div className="container">
                {this._projects()}
            </div>
            : <Spinner color="primary" size="25vw" className="my-5" centered/>
    )


}

/**
 * Wrapper for the projects component that passes in the user
 */
export const Projects: React.FC<{}> = () => {
    const {compId} = useParams<{compId?: string}>()

    if (compId) {
        return <UserContext.Consumer>
            {({currentUser: user}): JSX.Element => <ProjectsComponent
                user={user ?? undefined}
                compId={compId}
            />}
        </UserContext.Consumer>
    }

    return <>
        <h1>Error:</h1>
        <p>No competition ID specified</p>
    </>
}

export default Projects
