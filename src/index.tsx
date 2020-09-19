/**
 * Talentmaker website
 *
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
 * @author Luke Zhang - luke-zhang-04.github.io
 *
 * @license GPL-3.0
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
