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
    EditCompetition,
    EditProject,
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
import {NotificationContext, UserContext} from "./contexts"
import {NotificationType, Notifications} from "./components/notifications"
import {Route, BrowserRouter as Router, Switch} from "react-router-dom"
import {CognitoUser as User, userSchema} from "./schemas/user"
import ErrorBoundary from "./components/errorBoundary"
import Footer from "./components/footer"
import Nav from "./components/nav"
import React from "react"
import ReactDOM from "react-dom"
import {url} from "./globals"

// Hacky way to expose the addNotification callback
export let addNotification: ((notification: NotificationType | Error) => void) | undefined

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = React.useState<User | undefined>()
    const [notifications, setNotifications] = React.useState<{
        [timestamp: number]: NotificationType | Error
    }>({})

    const setUser = React.useCallback(async (user?: User | null): Promise<void> => {
        const isLoggedin = localStorage.getItem("loggedin") === "true"

        if (isLoggedin && (user === undefined || user === null)) {
            await fetch(`${url}/auth/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            localStorage.setItem("loggedin", "false")
        } else {
            localStorage.setItem("loggedin", "true")
        }

        setCurrentUser(user ?? undefined)
    }, [])

    const setUserFromUnknown = React.useCallback(
        async (user?: {[key: string]: unknown} | null): Promise<void> => {
            if (user === undefined || user === null || userSchema.isValidSync(user)) {
                return await setUser(user)
            }
        },
        [],
    )

    const _addNotification = React.useCallback((notification: NotificationType | Error) => {
        setNotifications((notifs) => ({...notifs, [Date.now()]: notification}))
    }, [])

    addNotification = _addNotification

    const removeNotification = React.useCallback((id: number) => {
        setNotifications((notifs) => {
            Reflect.deleteProperty(notifs, id)

            return notifs
        })
    }, [])

    React.useEffect(() => {
        ;(async () => {
            if (localStorage.getItem("loggedin") === "true") {
                const user = await adapters.auth.tokens()

                if (user instanceof Error) {
                    await setUser(undefined)
                    setCurrentUser((_currentUser) => _currentUser)

                    return
                }

                await setUser(user)
                setCurrentUser((_currentUser) => _currentUser)

                return
            }

            await setUser(undefined)
            setCurrentUser((_currentUser) => _currentUser)
        })()
    }, [])

    return (
        <UserContext.Provider value={{currentUser, setUser, setUserFromUnknown}}>
            <NotificationContext.Provider
                value={{addNotification: _addNotification, removeNotification, notifications}}
            >
                <ErrorBoundary>
                    <Notifications notifications={notifications} />
                    <Router>
                        <Nav />
                        <Switch>
                            <Route path="/" exact component={Home} />
                            <Route path="/auth" component={Auth} />
                            <Route path="/competition/:id" component={Competition} />
                            <Route path="/competitions" component={Competitions} />
                            <Route path="/editCompetition/:id" component={EditCompetition} />
                            <Route path="/editProject/:id?" component={EditProject} />
                            <Route path="/joinTeam/:data" component={JoinTeam} />
                            <Route path="/legal" component={Legal} />
                            <Route path="/privacy-policy" component={PrivacyPolicy} />
                            <Route path="/profile" component={Profile} />
                            <Route path="/project/:id" component={Project} />
                            <Route path="/project" component={Project} />
                            <Route path="/projects/:competitionId" component={Projects} />
                            <Route path="/talents" component={Talents} />
                            <Route path="/talentmakers" component={Talentmakers} />

                            {/* 404 */}
                            <Route component={NotFound} />
                        </Switch>
                        <Footer user={currentUser} />
                    </Router>
                </ErrorBoundary>
            </NotificationContext.Provider>
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
