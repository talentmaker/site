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
    const params = useParams<{uid: string}>()

    return <UserDisplay uid={params.uid} />
}

export default Profile
