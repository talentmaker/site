/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import React from "react"
import {Spinner} from "../components/bootstrap"
import {useParams} from "react-router"

const ProjectsComponent = React.lazy(() => import("../components/pages/projects"))

/**
 * Wrapper for the projects component that passes in the user
 */
export const Projects: React.FC<{}> = () => {
    const {compId} = useParams<{compId?: string}>()

    return compId ? (
        <React.Suspense
            fallback={<Spinner color="primary" size="25vw" className="my-5" centered />}
        >
            <ProjectsComponent compId={compId} />
        </React.Suspense>
    ) : (
        <>
            <h1>Error:</h1>
            <p>No competition ID specified</p>
        </>
    )
}

export default Projects
