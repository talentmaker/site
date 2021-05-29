/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import "./index.scss"
import {Link, useParams} from "react-router-dom"
import {Projects, projectsSchema} from "../../schemas/projects"
import {arrayToChunks, validate} from "../../utils"
import DefaultPhoto from "../../images/default.svg"
import {Img} from "../../components/elements"
import React from "react"
import {Spinner} from "../../components/bootstrap"
import {UserContext} from "../../contexts/userContext"
import cache from "../../utils/cache"
import {projectsAdapter} from "../../adapters/projects"

interface State {
    projects?: Projects
}

interface Props {
    compId: string
}

class ProjectsComponent extends React.PureComponent<Props, State> {
    public constructor(props: Props, context: React.ContextType<typeof UserContext>) {
        super(props)

        this.user = context.currentUser

        this.state = {
            projects: undefined,
        }
    }

    public componentDidMount = async (): Promise<void> => {
        this._handleCache()

        const projects = await projectsAdapter(this.props.compId)

        if (!(projects instanceof Error)) {
            this.setState({projects})
        }
    }

    public componentDidUpdate = async (): Promise<void> => {
        ;(await import("../../components/bootstrap/tooltip")).initTooltips()
    }

    public readonly user?: User

    public static contextType = UserContext

    context!: React.ContextType<typeof UserContext>

    private _handleCache = async (): Promise<void> => {
        const data = await validate(
            projectsSchema,
            await cache.read("talentmakerCache_projects"),
            false,
        )

        if (data !== undefined) {
            this.setState({projects: data})
        }
    }

    /**
     * Sort projects into "chunks"
     */
    private _getSortedComponents = (): Projects[][] => {
        // Projects due in the future and past
        const advancing: Projects = []
        const submitted = this.state.projects ?? []

        return [arrayToChunks(advancing), arrayToChunks(submitted)]
    }

    private _project = (project: Projects[0], index: number): JSX.Element => (
        <div key={`comp-col-${index}-${project.id}`} className="col-lg-4 my-3">
            <div className="project-card">
                <Img src={project.coverImageURL ?? DefaultPhoto} alt="cover">
                    <Spinner color="primary" size="6rem" centered />
                </Img>
                <div className="project-info">
                    <div className="container-fluid project-details">
                        <h3>{project.name}</h3>
                        <Link to={`/project/${project.id}`} className="btn btn-outline-primary">
                            Details
                        </Link>
                        {
                            // This project belongs to this user
                            this.user?.sub === project.creator ? (
                                <Link
                                    to={`/editProject/${project.id}`}
                                    className="btn btn-outline-dark d-inline-block float-right"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="left"
                                    title="Edit"
                                >
                                    <span className="material-icons">create</span>
                                </Link>
                            ) : undefined
                        }
                    </div>
                </div>
            </div>
        </div>
    )

    private _projects = (): JSX.Element => {
        const projects = this._getSortedComponents()

        return (
            <>
                <h1 className="my-3">Advancing</h1>
                {(projects[0]?.length ?? 0) > 0 ? (
                    projects[0].map((row, index) => (
                        <div key={`project-row-${index}`} className="row g-3">
                            {row.map((project) => this._project(project, index))}
                        </div>
                    ))
                ) : (
                    <p>None</p>
                )}

                <h1 className="mb-3">Submitted</h1>
                {projects[1]?.map((row, index) => (
                    <div key={`project-row-${index}`} className="row g-3">
                        {row.map((project) => this._project(project, index))}
                    </div>
                ))}
            </>
        )
    }

    public render = (): JSX.Element =>
        this.state.projects ? (
            <div className="container-fluid">{this._projects()}</div>
        ) : (
            <Spinner color="primary" size="25vw" className="my-5" centered />
        )
}

/**
 * Wrapper for the projects component that passes in the user
 */
export const ProjectsWrapper: React.FC<{}> = () => {
    const {compId} = useParams<{compId?: string}>()

    return compId ? (
        <ProjectsComponent compId={compId} />
    ) : (
        <>
            <h1>Error:</h1>
            <p>No competition ID specified</p>
        </>
    )
}

export default ProjectsWrapper
