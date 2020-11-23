import type {App} from "."
import React from "react"

export const UserContext = React.createContext<App.Context>({
    currentUser: undefined,
    setUser: () => new Promise((resolve) => resolve()),
    setUserFromUnknown: () => new Promise((resolve) => resolve()),
})

export default UserContext
