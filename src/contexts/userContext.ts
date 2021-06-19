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

/**
 * React user context type
 */
export interface Context {
    currentUser: undefined | User

    /**
     * Set the current loggedin user
     */
    setUser: (user: Context["currentUser"]) => Promise<void>

    /**
     * Set the current loggedin user from an unknown object that is validated
     */
    setUserFromUnknown: (user?: {[key: string]: unknown} | null) => Promise<void>
}

export const UserContext = React.createContext<Context>({
    currentUser: undefined,
    setUser: () => new Promise((resolve) => resolve()),
    setUserFromUnknown: () => new Promise((resolve) => resolve()),
})

export default UserContext
