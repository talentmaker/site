/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {Button, Col, Container, Row} from "react-bootstrap"
import AuthImage from "./authimage.svg"
import {Img} from "~/components/elements"
import Login from "./login"
import React from "react"
import Reg from "./register"
import {useQuery} from "~/hooks"

export const Auth: React.FC = () => {
    const {
        query: {mode},
        setQuery,
    } = useQuery<{mode?: string}>()

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
                <Button
                    onClick={() => setQuery({mode: "login"})}
                    variant="link"
                    className="text-center px-5 mt-3 ms-auto me-auto d-block"
                >
                    Already Have an Account? Login!
                </Button>
            ) : (
                <Button
                    onClick={() => setQuery({mode: "register"})}
                    variant="link"
                    className="text-center px-5 mt-3 ms-auto me-auto d-block"
                >
                    Don&apos;t Have an Account? Register!
                </Button>
            )}
        </Container>
    )
}

export default Auth
