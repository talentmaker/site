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
import {Project as ProjectType, projectSchema} from "../../../schemas/project"
import {Spinner, initTooltips} from "../../bootstrap"
import {Link} from "react-router-dom"
import Markdown from "../../markdown"
import Prism from "prismjs"
import React from "react"
import UserContext from "../../../contexts/userContext"
import cache from "../../../utils/cache"
import getProjectData from "./utils"
import projectAdapter from "../../../adapters/project"
import scrollToHeader from "../../../components/markdown/scrollToHeader"
import {validate} from "../../../utils"

type Props = {
    /**
     * Project id
     */
    id?: string

    /**
     * Competition id
     */
    compId?: string
}

export const Project: React.FC<Props> = (props) => {
    const [project, setProject] = React.useState<ProjectType | undefined>()
    const {currentUser: user} = React.useContext(UserContext)

    const setup = React.useCallback(() => {
        ;(async () => {
            const data = await cache.read(`talentmakerCache_competition-${props.id}`)

            setProject(await validate(projectSchema, data, false))
        })()
        ;(async () => {
            const data = await projectAdapter(user, props.id, props.compId)

            if (!(data instanceof Error)) {
                setProject(data)
            }
        })()
    }, [props.id, props.compId, user])

    React.useEffect(() => {
        setup()

        if (window.location.hash) {
            scrollToHeader(window.location.hash)
        }
    }, [props.id, props.compId, user])

    React.useEffect(() => {
        Prism.highlightAll()

        initTooltips()
    })

    const getData = React.useCallback(getProjectData, [])

    if (project) {
        const data = getData(project)

        return (
            <>
                <Components.UserInfo
                    username={project.name ?? "Submission"}
                    desc={`Submission for ${project.name ?? "Submission"}`}
                >
                    {(user?.sub ?? "") === project.creator ? (
                        <Link
                            className="btn btn-outline-dark mx-2"
                            to={`/editProject/${project.id ?? ""}`}
                        >
                            <span className="material-icons">create</span> Edit Submission
                        </Link>
                    ) : undefined}
                </Components.UserInfo>
                <div className="row bg-primary bar">
                    <div className="col-sm-12 topics">
                        {" "}
                        {/* Blue bar with competitions */}
                        {project.topics?.map((topic, index) => (
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
                                <Markdown>{project.desc ?? ""}</Markdown>
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

export default Project
