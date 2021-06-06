/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import CompetitionComponent from "../components/pages/competition"
import type React from "react"
import {useParams} from "react-router-dom"

export const Competition: React.FC = () => {
    const {id} = useParams<{id?: string}>()

    return id ? (
        <CompetitionComponent id={id} />
    ) : (
        <>
            <h1>Error:</h1>
            <p>No competition ID specified</p>
        </>
    )
}

export default Competition
