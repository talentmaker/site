/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import ProjectComponent from "../components/pages/project"
import type React from "react"
import queryString from "query-string"
import {useParams} from "react-router"

export const Project: React.FC = () => {
    const {id} = useParams<{id?: string}>()
    const {competition: compId} = queryString.parse(window.location.search)

    if (id) {
        return <ProjectComponent id={id} />
    } else if (typeof compId === "string") {
        return <ProjectComponent compId={compId} />
    }

    return (
        <>
            <h1>Error:</h1>
            <p>No Project ID specified</p>
        </>
    )
}

export default Project
