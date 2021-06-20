/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file entry Point for this react application including the app component
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
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
import("./styles/vendor.scss") // Hacky way to enable code-splitting for vendor css

import * as serviceWorker from "./serviceWorker"
import {
    Auth,
    Competition,
    Competitions,
    EditCompetition,
    EditProject,
    Home,
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
import {CognitoUser as User, isUser} from "./schemas/user"
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
            if (user === undefined || user === null || isUser(user)) {
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
                const user = (await (
                    await fetch(`${url}/auth/tokens`, {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                ).json()) as {[key: string]: unknown}

                if (isUser(user)) {
                    await setUser(user)
                    setCurrentUser((_currentUser) => _currentUser)

                    return
                }

                await setUser(undefined)
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
                        <Route path="/legal" component={Legal} />
                        <Route path="/privacy-policy" component={PrivacyPolicy} />
                        <Route path="/profile" component={Profile} />
                        <Route path="/project/:id" component={Project} />
                        <Route path="/project" component={Project} />
                        <Route path="/projects/:compId" component={Projects} />
                        <Route path="/talents" component={Talents} />
                        <Route path="/talentmakers" component={Talentmakers} />

                        {/* 404 */}
                        <Route component={NotFound} />
                    </Switch>
                    <Footer user={currentUser} />
                </Router>
            </NotificationContext.Provider>
        </UserContext.Provider>
    )
}

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

/*
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: https://bit.ly/CRA-PWA
 */
serviceWorker.register()
