/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import AuthImage from "./authimage.svg"
import {Img} from "../../elements"
import {Link} from "react-router-dom"
import Login from "./login"
import React from "react"
import Reg from "./register"
import qs from "query-string"
import {useLocation} from "react-router"

export const Auth: React.FC = () => {
    const [mode, setMode] = React.useState("register")
    const location = useLocation()

    React.useEffect(() => {
        const _mode = qs.parse(location.search).mode as string

        if (_mode !== mode) {
            setMode(_mode)
        }
    }, [location])

    return (
        <div className="container-fluid my-5">
            <div className="row py-5">
                <div className="col-6 bg-primary align-items-center justify-content-center d-flex py-5">
                    <Img src={AuthImage} alt="auth images" className="w-75 flex-center" />
                </div>
                <div className="col-6 text-center bg-lighter p-5 align-items-center justify-content-center d-flex">
                    {mode === "register" ? <Reg /> : <Login />}
                </div>
            </div>
            {mode === "register" ? (
                <Link
                    to="/auth?mode=login"
                    className="text-center px-5 mt-3 ms-auto me-auto d-block"
                >
                    Already Have an Account? Login!
                </Link>
            ) : (
                <Link
                    to="/auth?mode=register"
                    className="text-center px-5 mt-3 ms-auto me-auto d-block"
                >
                    Don&apos;t Have an Account? Register!
                </Link>
            )}
        </div>
    )
}

export default Auth
