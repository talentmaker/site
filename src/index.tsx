/**
 * Talentmaker website
 *
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
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
import {CognitoUser, isCognitoUser} from "./cognito-utils"
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
import React from "react"
import ReactDOM from "react-dom"
import UserContext from "./userContext"
import {url} from "./globals"

export const appRef = React.createRef<App>()

export declare namespace AppTypes {
    export interface Props {}

    export interface State {
        isAuthenticated: boolean,
        currentUser?: CognitoUser,
        notification?: JSX.Element,
    }

    export interface Context {
        currentUser: undefined | CognitoUser | null,
        setUser: (user: Context["currentUser"])=> Promise<void>,
        setUserFromUnknown: (
            user?: {[key: string]: unknown} | null,
        )=> Promise<void>,
    }
}

class App extends React.Component<AppTypes.Props, AppTypes.State> {

    public constructor (props: AppTypes.Props) {
        super(props)

        this.state = {
            isAuthenticated: false,
            currentUser: undefined,
            notification: undefined,
        }
    }

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

    public setUserFromUnknown = async (
        user?: {[key: string]: unknown} | null,
    ): Promise<void> => {
        if (user === undefined || user === null || isCognitoUser(user)) {
            return await this.setUser(user)
        }
    }

    public setUser = async (user?: CognitoUser | null): Promise<void> => {
        const isloggedin = localStorage.getItem("loggedin") === "true"

        if (isloggedin && (user === undefined || user === null)) {
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
                <Route path="/competition" component={Competition}/>
                <Route path="/competitions" component={Competitions}/>
                <Route path="/editCompetition/:id" component={EditCompetition}/>
                <Route path="/editProject" component={EditProject}/>
                <Route path="/legal" component={Legal}/>
                <Route path="/privacy-policy" component={PrivacyPolicy}/>
                <Route
                    path="/profile"
                    render={(): JSX.Element => <Profile user={this.state.currentUser}/>}
                />
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
