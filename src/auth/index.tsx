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

import {Link, withRouter} from "react-router-dom"
import Login from "./login"
import React from "react"
import Reg from "./register"
import queryString from "query-string"

type StringObj<T> = {[key: string]: T}

interface AuthState {
    mode: string,
}

@(withRouter as any)
export default class Auth extends React.Component<{}, AuthState> {

    private static _toReg = (): JSX.Element => <Link to="/auth?mode=register" className="text-center px-5 mt-3 ml-auto mr-auto d-block">Don&apos;t Have an Account? Register!</Link>

    private static _toLogin = (): JSX.Element => <Link to="/auth?mode=login" className="text-center px-5 mt-3 ml-auto mr-auto d-block">Already Have an Account? Login!</Link>

    public constructor (props: {}) {
        super(props)

        this.state = {
            mode: "login",
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
            (this.props as StringObj<StringObj<string>>)?.location.search,
        )?.mode as string

        if (mode !== prevMode) {
            this.setState({mode})
        }
    }

    public render = (): JSX.Element => (
        <div className="container my-5">
            <div className="row py-5">
                <div className="col-6 bg-primary align-items-center justify-content-center d-flex py-5">
                    <img
                        src="images/authform.svg"
                        alt="auth images"
                        className="w-75 flex-center"
                    />
                </div>
                <div className="col-6 text-center bg-white p-5 align-items-center justify-content-center d-flex">
                    {this.state.mode === "login" ? <Login/> : <Reg/>}
                </div>
            </div>
            {
                this.state.mode === "login"
                    ? <Auth._toReg/>

                    : <Auth._toLogin/>
            }
        </div>
    )

}

// <Link to="/auth?mode=register" className="text-center px-5 mt-3 ml-auto mr-auto d-block">Don&apos;t Have an Account? Register!</Link>

// <Link to="/auth?mode=login" className="text-center px-5 mt-3 ml-auto mr-auto d-block">Already Have an Account? Login!</Link>
