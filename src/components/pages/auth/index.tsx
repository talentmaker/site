/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {Col, Container, Row} from "react-bootstrap"
import AuthImage from "./authimage.svg"
import {Img} from "~/components/elements"
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
        <Container fluid className="my-5">
            <Row className="py-5">
                <Col
                    xs={12}
                    md={6}
                    className="bg-primary align-items-center justify-content-center d-flex py-5"
                >
                    <Img src={AuthImage} alt="auth images" className="w-75 flex-center" />
                </Col>
                <Col
                    xs={12}
                    md={6}
                    className="text-center bg-lighter p-3 p-md-5 align-items-center justify-content-center d-flex"
                >
                    {mode === "register" ? <Reg /> : <Login />}
                </Col>
            </Row>
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
        </Container>
    )
}

export default Auth
