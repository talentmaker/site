import type {AppTypes} from "."
import React from "react"

export const UserContext = React.createContext<AppTypes.Context>({
    currentUser: undefined,
    setUser: () => new Promise((resolve) => resolve()),
    setUserFromUnknown: () => new Promise((resolve) => resolve()),
})

export default UserContext
