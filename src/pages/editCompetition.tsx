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

const EditCompetitionComponent = React.lazy(() => import("../components/pages/editCompetition"))

export const EditCompetition: React.FC = () => {
    const {id} = useParams<{id: string}>()

    return (
        <React.Suspense
            fallback={<Spinner color="primary" size="25vw" className="my-5" centered />}
        >
            <EditCompetitionComponent
                id={id === "new" || id === undefined ? undefined : Number(id)}
            />
        </React.Suspense>
    )
}

export default EditCompetition
