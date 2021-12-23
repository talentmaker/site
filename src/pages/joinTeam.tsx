/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import JoinTeamComponent from "../components/pages/joinTeam"
import React from "react"
import {useParams} from "react-router-dom"

export const EditProject: React.FC = () => {
    const {data} = useParams<{data?: string}>()

    return data ? (
        <JoinTeamComponent data={data} />
    ) : (
        <>
            <h1>Error:</h1>
            <p>Data param not specified</p>
        </>
    )
}

export default EditProject
