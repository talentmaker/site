/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import ProjectsComponent from "../components/pages/projects"
import type React from "react"
import {useParams} from "react-router"

/**
 * Wrapper for the projects component that passes in the user
 */
export const Projects: React.FC<{}> = () => {
    const {competitionId} = useParams<{competitionId?: string}>()

    return competitionId ? (
        <ProjectsComponent competitionId={competitionId} />
    ) : (
        <>
            <h1>Error:</h1>
            <p>No competition ID specified</p>
        </>
    )
}

export default Projects
