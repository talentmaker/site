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
import Login from "./login"
import React from "react"
import Reg from "./register"
import queryString from "query-string"
import {withRouter} from "react-router-dom"

type StringObj<T> = {[key: string]: T}

interface AuthState {
    mode: string,
}

@(withRouter as any)
export default class Auth extends React.Component<{}, AuthState> {

    public constructor (props: {}) {
        super(props)

        this.state = {
            mode: "login"
        }
    }

    /**
     * Gets current route and calls this._onRouteChanged
     * @returns {void} void
     */
    public componentDidMount = (): void => {
        this._onRouteChanged(this.state.mode)
    }

    /**
     * Gets current route and calls this._onRouteChanged
     * @returns {void} void
     */
    public componentDidUpdate = (): void => {
        this._onRouteChanged(this.state.mode)
    }

    /**
     * Changes state based to current pathname
     * @param {string} prevMode - previous mode to avoid infinite updates
     * @returns {void} void
     */
    private _onRouteChanged = (prevMode: string): void => {
        const mode = queryString.parse(
            (this.props as StringObj<StringObj<string>>)?.location.search
        )?.mode as string

        if (mode !== prevMode) {
            this.setState({mode})
        }
    }

    public render = (): JSX.Element => (
        <>
            {this.state.mode === "login" ? <Login/> : <Reg/>}
        </>
    )

}

// <Link to="/auth?mode=register" className="text-center px-5 mt-3 ml-auto mr-auto d-block">Don&apos;t Have an Account? Register!</Link>

// <Link to="/auth?mode=login" className="text-center px-5 mt-3 ml-auto mr-auto d-block">Already Have an Account? Login!</Link>
