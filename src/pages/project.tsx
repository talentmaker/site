/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import ProjectComponent from "../components/pages/project"
import type React from "react"
import {useParams} from "react-router"
import {useQuery} from "~/hooks"

export const Project: React.FC = () => {
    const {id} = useParams<{id?: string}>()
    const {
        query: {competition: competitionId},
    } = useQuery()

    if (id) {
        return <ProjectComponent id={id} />
    } else if (typeof competitionId === "string") {
        return <ProjectComponent competitionId={competitionId} />
    }

    return (
        <>
            <h1>Error:</h1>
            <p>No Project ID specified</p>
        </>
    )
}

export default Project
