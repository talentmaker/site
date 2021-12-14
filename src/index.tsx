/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file entry Point for this react application including the app component
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

// Load Prismjs languages
import "prismjs"
import "prismjs/components/prism-clike"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-python"

// Styles
import "./styles/global.scss"

import * as adapters from "./adapters"
import * as serviceWorker from "./serviceWorker"
import * as webVitals from "./reportWebVitals"
import {
    Auth,
    Competition,
    Competitions,
    Home,
    JoinTeam,
    Legal,
    NotFound,
    PrivacyPolicy,
    Profile,
    Project,
    Projects,
    Talentmakers,
    Talents,
} from "./pages"
import {NotificationContext, ThemeContext, UserContext} from "./contexts"
import {NotificationType, Notifications} from "./components/notifications"
import {BrowserRouter as Router, Switch} from "react-router-dom"
import {CognitoUser as User, userSchema} from "./schemas/user"
import ErrorBoundary from "./components/errorBoundary"
import Footer from "./components/footer"
import Nav from "./components/nav"
import React from "react"
import ReactDOM from "react-dom"
import {Route} from "./components/route"
import {url} from "./globals"

// Hacky way to expose the addNotification callback
export let addNotification: ((notification: NotificationType | Error) => void) | undefined

const applyTheme = (theme: "light" | "dark") => {
    const root = document.querySelector(":root") as HTMLElement
    const styles = getComputedStyle(root)

    const getProperty = (prop: string): string => styles.getPropertyValue(`--${prop}`)

    const colors = {
        "--white": "#000",
        "--white-rgb": getProperty("black-rgb"),
        "--black-rgb": getProperty("white-rgb"),
        "--body-bg": getProperty("dark"),
        "--body-rgb": getProperty("dark-rgb"),
        "--body-color": getProperty("light"),

        "--gray-dark": getProperty("gray-200"),
        "--gray-100": getProperty("gray-900"),
        "--gray-200": getProperty("gray-800"),
        "--gray-300": getProperty("gray-700"),
        "--gray-400": getProperty("gray-600"),
        "--gray-600": getProperty("gray-400"),
        "--gray-700": getProperty("gray-300"),
        "--gray-800": getProperty("gray-200"),
        "--gray-900": getProperty("gray-100"),

        "--lighter": getProperty("darker"),
        "--darker": getProperty("lighter"),
        "--light": getProperty("dark"),
        "--dark": getProperty("light"),
        "--light-grey": getProperty("dark-grey"),
        "--dark-grey": getProperty("light-grey"),

        "--lighter-rgb": getProperty("darker-rgb"),
        "--darker-rgb": getProperty("lighter-rgb"),
        "--light-rgb": getProperty("dark-rgb"),
        "--dark-rgb": getProperty("light-rgb"),
        "--light-grey-rgb": getProperty("dark-grey-rgb"),
        "--dark-grey-rgb": getProperty("light-grey-rgb"),
    }

    if (theme === "light") {
        for (const key of Object.keys(colors)) {
            root.style.setProperty(key, "")
        }
    } else if (styles.getPropertyValue("--darker") === "#272727") {
        // If dark theme and dark theme hasn't been applied
        for (const [key, value] of Object.entries(colors)) {
            root.style.setProperty(key, value)
        }
    }
}

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = React.useState<User | undefined>()
    const [notifications, setNotifications] = React.useState<{
        [timestamp: number]: NotificationType | Error
    }>({})
    const [theme, setTheme] = React.useState<"light" | "dark">("light")

    const setUser = React.useCallback(async (user?: User | null): Promise<void> => {
        if (currentUser && (user === undefined || user === null)) {
            await fetch(`${url}/auth/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })
        }

        setCurrentUser(user ?? undefined)
    }, [])

    const setUserFromUnknown = async (user?: {[key: string]: unknown} | null): Promise<void> => {
        if (user === undefined || user === null || userSchema.isValidSync(user)) {
            return await setUser(user)
        }
    }

    const setThemeContext = (newTheme: string) => {
        if (newTheme === "dark" || newTheme === "light") {
            setTheme(newTheme)
        } else {
            setTheme("light")
        }
    }

    const _addNotification = (notification: NotificationType | Error) => {
        setNotifications((notifs) => ({...notifs, [Date.now()]: notification}))
    }

    addNotification = _addNotification

    const removeNotification = (id: number) => {
        setNotifications((notifs) => {
            Reflect.deleteProperty(notifs, id)

            return notifs
        })
    }

    React.useEffect(() => {
        ;(async () => {
            const user = await adapters.auth.tokens()

            if (user instanceof Error) {
                await setUser(undefined)
            } else {
                await setUser(user)
            }

            setCurrentUser((_currentUser) => _currentUser)
        })()

        const deviceTheme = window.matchMedia?.("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"

        setThemeContext(deviceTheme)

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
            if (event.matches) {
                setThemeContext("dark")
            } else {
                setThemeContext("light")
            }
        })
    }, [])

    React.useEffect(() => {
        applyTheme(theme)
    }, [theme])

    return (
        <UserContext.Provider value={{currentUser, setUser, setUserFromUnknown}}>
            <ThemeContext.Provider value={{theme, setTheme: setThemeContext}}>
                <NotificationContext.Provider
                    value={{addNotification: _addNotification, removeNotification, notifications}}
                >
                    <ErrorBoundary>
                        <Notifications notifications={notifications} />
                        <Router>
                            <div>
                                <Nav />
                                {/* prettier-ignore */}
                                <Switch>
                                    <Route path="/" exact component={Home} title="Home | Talentmaker" />
                                    <Route path="/auth" component={Auth} title="Auth | Talentmaker" />
                                    <Route path="/competition/:id" component={Competition} title="Competition | Talentmaker" />
                                    <Route path="/competitions" component={Competitions} title="Competitions | Talentmaker" />
                                    <Route path="/joinTeam/:data" component={JoinTeam} title="JoinTeam | Talentmaker" />
                                    <Route path="/legal" component={Legal} title="Legal | Talentmaker" />
                                    <Route path="/privacy-policy" component={PrivacyPolicy} title="PrivacyPolicy | Talentmaker" />
                                    <Route path="/profile/:uid" component={Profile} title="Profile | Talentmaker" />
                                    <Route path="/project/:id" component={Project} title="Project | Talentmaker" />
                                    <Route path="/project" component={Project} title="Project | Talentmaker" />
                                    <Route path="/projects/:competitionId" component={Projects} title="Projects | Talentmaker" />
                                    <Route path="/talents" component={Talents}  title="Talents | Talentmaker"/>
                                    <Route path="/talentmakers" component={Talentmakers} title="Talentmakers | Talentmaker" />

                                    {/* 404 */}
                                    <Route component={NotFound} />
                                </Switch>
                            </div>
                            <Footer user={currentUser} />
                        </Router>
                    </ErrorBoundary>
                </NotificationContext.Provider>
            </ThemeContext.Provider>
        </UserContext.Provider>
    )
}

// Hacky way to enable code-splitting for vendor css
import("./styles/vendor.scss").then(() => {
    // Apply fade out, render content. Is it hacky? Yes. Does it work? Yes.
    document.querySelector(".loading-container")?.classList.add("fade-out")

    const timeout = 200

    setTimeout(() => {
        ReactDOM.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>,
            document.getElementById("root"),
        )
    }, timeout)
})

/**
 * If you want your app to work offline and load faster, you can change `unregister()` to
 * `register()` below. Note this comes with some pitfalls. Learn more about service workers:
 * https://bit.ly/CRA-PWA
 */
serviceWorker.register()

/**
 * If you want to start measuring performance in your app, pass a function to log results (for
 * example: `webVitals.report(console.log))` or send to an analytics endpoint. Learn more:
 * https://bit.ly/CRA-vitals
 */
webVitals.report()
