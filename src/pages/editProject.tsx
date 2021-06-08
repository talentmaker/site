/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import EditProjectComponent from "../components/pages/editProject"
import React from "react"
import queryString from "query-string"
import {useParams} from "react-router-dom"

export const EditProject: React.FC = () => {
    const {id} = useParams<{id?: string}>()
    const {competition: compId} = queryString.parse(window.location.search)

    if (id) {
        return <EditProjectComponent id={id} />
    } else if (typeof compId === "string") {
        return (
            <EditProjectComponent compId={compId} />
        )
    }

    return (
        <>
            <h1>Error:</h1>
            <p>No competition or project ID specified</p>
        </>
    )
}

export default EditProject
