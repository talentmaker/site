/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import type React from "react"
import {UserDisplay} from "../components/pages/profile"
import {useParams} from "react-router"

export const Profile: React.FC = () => {
    const {uid} = useParams<{uid: string}>()

    return uid ? (
        <UserDisplay uid={uid} />
    ) : (
        <>
            <h1>Error:</h1>
            <p>No UID specified</p>
        </>
    )
}

export default Profile
