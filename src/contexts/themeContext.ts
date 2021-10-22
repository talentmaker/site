/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import React from "react"

export interface Context {
    theme: "light" | "dark"
    setTheme: (theme: string) => void
}

const theme = localStorage.getItem("theme")

export const ThemeContext = React.createContext<Context>({
    theme: theme === "light" || theme === "dark" ? theme : "light",
    setTheme: () => {},
})

export default ThemeContext
