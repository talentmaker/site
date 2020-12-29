/**
 * Talentmaker website
 *
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 */

import EditProjectComponent from "./component"
import React from "react"
import UserContext from "../userContext"
import queryString from "query-string"

export const EditProject = (): JSX.Element => {
    const query = queryString.parse(window.location.search)

    if ("compId" in query && typeof query.compId === "string") {
        return <UserContext.Consumer>
            {({currentUser: user}): JSX.Element => <EditProjectComponent
                id={query.compId as string}
                user={user ?? undefined}
            />}
        </UserContext.Consumer>
    }

    return <>
        <h1>Error:</h1>
        <p>No competition ID specified</p>
    </>
}

export default EditProject
