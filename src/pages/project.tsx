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
import queryString from "query-string"
import {useParams} from "react-router"

const ProjectComponent = React.lazy(() => import("../components/pages/project"))

export const Project: React.FC = () => {
    const {id} = useParams<{id?: string}>()
    const {competition: compId} = queryString.parse(window.location.search)

    if (id) {
        return (
            <React.Suspense
                fallback={<Spinner color="primary" size="25vw" className="my-5" centered />}
            >
                <ProjectComponent id={id} />
            </React.Suspense>
        )
    } else if (typeof compId === "string") {
        return (
            <React.Suspense
                fallback={<Spinner color="primary" size="25vw" className="my-5" centered />}
            >
                <ProjectComponent compId={compId} />
            </React.Suspense>
        )
    }

    return (
        <>
            <h1>Error:</h1>
            <p>No Project ID specified</p>
        </>
    )
}

export default Project
