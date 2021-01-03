/**
 * Talentmaker website
 *
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 */

import EditCompetitionComponent from "./component"
import React from "react"
import UserContext from "../userContext"
import {useParams} from "react-router-dom"

export const EditCompetitions: React.FC<{}> = () => {
    const {id} = useParams<{id: string}>()

    return <UserContext.Consumer>
        {({currentUser: user}): JSX.Element => <EditCompetitionComponent
            user={user ?? undefined}
            id={id === "new" || id === undefined ? undefined : Number(id)}
        />}
    </UserContext.Consumer>
}

export default EditCompetitions
