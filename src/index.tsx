/**
 * Talentmaker website
 *
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 * @file entry point for this react application including the app component
 */
// Load Prismjs languages
import "prismjs"
import "prismjs/components/prism-clike"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-python"

// Styles
import "./styles.scss"

import * as serviceWorker from "./serviceWorker"
import {CognitoUser, isCognitoUser} from "./utils/cognito"
import {Route, BrowserRouter as Router, Switch} from "react-router-dom"
import Auth from "./auth"
import Competition from "./competition"
import Competitions from "./competitions"
import EditCompetition from "./editCompetition"
import EditProject from "./editProject"
import Footer from "./footer"
import Home from "./home"
import Legal from "./legal/Legal"
import Nav from "./nav"
import PrivacyPolicy from "./legal/PrivacyPolicy"
import Profile from "./profile"
import Project from "./project"
import Projects from "./projects"
import React from "react"
import ReactDOM from "react-dom"
import UserContext from "./userContext"
import {url} from "./globals"

export const appRef = React.createRef<App>()

/**
 * Typedefs for app
 */
export declare namespace AppTypes {
    export interface Props {}

    export interface State {
        isAuthenticated: boolean,
        currentUser?: CognitoUser,

        /**
         * Current notification to show
         */
        notification?: JSX.Element,
    }

    /**
     * React user context type
     */
    export interface Context {
        currentUser: undefined | CognitoUser | null,

        /**
         * Set the current loggedin user
         */
        setUser: (user: Context["currentUser"])=> Promise<void>,

        /**
         * Set the current loggedin user from an unknown object that is validated
         */
        setUserFromUnknown: (
            user?: {[key: string]: unknown} | null,
        )=> Promise<void>,
    }
}

/**
 * Main App component with Router and such
 */
class App extends React.Component<AppTypes.Props, AppTypes.State> {

    public constructor (props: AppTypes.Props) {
        super(props)

        this.state = {
            isAuthenticated: false,
            currentUser: undefined,
            notification: undefined,
        }
    }

    /**
     * User HTTPonly cookie refresh token and try to get an idToken
     */
    public componentDidMount = async (): Promise<void> => {
        if (localStorage.getItem("loggedin") === "true") {
            const user = await (await fetch(
                `${url}/auth/tokens`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )).json() as {[key: string]: unknown}

            if (isCognitoUser(user)) {
                await this.setUser(user)
                this.setState({})

                return
            }

            await this.setUser(undefined)
            this.setState({})

            return
        }

        await this.setUser(undefined)
        this.setState({})
    }

    /**
     * Sets the user to state
     * @param user - unknown object that will go through validation OR
     * `undefined | null` for logout
     */
    public setUserFromUnknown = async (
        user?: {[key: string]: unknown} | null,
    ): Promise<void> => {
        if (user === undefined || user === null || isCognitoUser(user)) {
            return await this.setUser(user)
        }
    }

    /**
     * Sets the user to state
     * @param user - object with user info OR `undefined | null` to logout
     */
    public setUser = async (user?: CognitoUser | null): Promise<void> => {
        const isLoggedin = localStorage.getItem("loggedin") === "true"

        if (isLoggedin && (user === undefined || user === null)) {
            await fetch(
                `${url}/auth/logout`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )

            localStorage.setItem("loggedin", "false")
        } else {
            localStorage.setItem("loggedin", "true")
        }

        this.setState({
            isAuthenticated: !(user === undefined || user === null),
            currentUser: user ?? undefined,
        })
    }

    public render = (): JSX.Element => <UserContext.Provider
        value={{
            currentUser: this.state.currentUser,
            setUser: this.setUser,
            setUserFromUnknown: this.setUserFromUnknown,
        }}
    >
        {this.state.notification}
        <Router>
            <Nav/>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/auth" component={Auth}/>
                <Route path="/competition/:id" component={Competition}/>
                <Route path="/competitions" component={Competitions}/>
                <Route path="/editCompetition/:id" component={EditCompetition}/>
                <Route path="/editProject/:id?" component={EditProject}/>
                <Route path="/legal" component={Legal}/>
                <Route path="/privacy-policy" component={PrivacyPolicy}/>
                <Route
                    path="/profile"
                    render={(): JSX.Element => <Profile user={this.state.currentUser}/>}
                />
                <Route path="/project/:id" component={Project}/>
                <Route path="/project" component={Project}/>
                <Route path="/projects/:compId" component={Projects}/>
            </Switch>
            <Footer/>
        </Router>
    </UserContext.Provider>

}

ReactDOM.render(
    <React.StrictMode>
        <App ref={appRef}/>
    </React.StrictMode>,
    document.getElementById("root"),
)

/*
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: https://bit.ly/CRA-PWA
 */
serviceWorker.unregister()
