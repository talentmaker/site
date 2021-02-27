/**
 * Talentmaker website
 *
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 */

import {Link, withRouter} from "react-router-dom"
import AuthImage from "./authimage.svg"
import {Img} from "../elements"
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

    private static _toReg = (): JSX.Element => <Link
        to="/auth?mode=register"
        className="text-center px-5 mt-3 ml-auto mr-auto d-block"
    >Don&apos;t Have an Account? Register!</Link>

    private static _toLogin = (): JSX.Element => <Link
        to="/auth?mode=login"
        className="text-center px-5 mt-3 ml-auto mr-auto d-block"
    >Already Have an Account? Login!</Link>

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
        <div className="container-fluid my-3 my-md-5">
            <div className="row py-md-5">
                <div
                    className="col-12
                        col-md-6
                        bg-primary
                        align-items-center
                        justify-content-center
                        d-flex
                        py-5"
                >
                    <Img
                        src={AuthImage}
                        alt="auth images"
                        className="w-75 flex-center"
                    />
                </div>
                <div
                    className="col-12
                        col-md-6
                        text-center
                        bg-lighter
                        p-3
                        p-md-5
                        align-items-center
                        justify-content-center
                        d-flex"
                >
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
