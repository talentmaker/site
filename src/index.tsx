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
import * as serviceWorker from "./serviceWorker"
import {Route, BrowserRouter as Router, Switch} from "react-router-dom"
import Auth from "./auth"
import Footer from "./footer"
import Home from "./home"
import Legal from "./legal/Legal"
import Nav from "./Nav"
import PrivacyPolicy from "./legal/PrivacyPolicy"
import React from "react"
import ReactDOM from "react-dom"

const App = (): JSX.Element => (
    <Router>
        <Nav/>
        <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/legal" component={Legal}/>
            <Route path="/privacy-policy" component={PrivacyPolicy}/>
            <Route path="/auth" component={Auth}/>
        </Switch>
        <Footer/>
    </Router>
)

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById("root"),
)

/*
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: https://bit.ly/CRA-PWA
 */
serviceWorker.unregister()
