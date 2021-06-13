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
import {useParams} from "react-router-dom"

const CompetitionComponent = React.lazy(() => import("../components/pages/competition"))

export const Competition: React.FC = () => {
    const {id} = useParams<{id?: string}>()

    return id ? (
        <React.Suspense
            fallback={<Spinner color="primary" size="25vw" className="my-5" centered />}
        >
            <CompetitionComponent id={id} />
        </React.Suspense>
    ) : (
        <>
            <h1>Error:</h1>
            <p>No competition ID specified</p>
        </>
    )
}

export default Competition
