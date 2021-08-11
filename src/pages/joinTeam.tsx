/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import JoinTeamComponent from "../components/pages/joinTeam"
import React from "react"
import queryString from "query-string"
import {useParams} from "react-router-dom"

export const EditProject: React.FC = () => {
    const {data} = useParams<{data?: string}>()
    const {integrity} = queryString.parse(window.location.search)

    if (data && typeof integrity === "string") {
        return <JoinTeamComponent {...{data, integrity}} />
    }

    return (
        <>
            <h1>Error:</h1>
            <p>Bad query; no integrity specified</p>
        </>
    )
}

export default EditProject
