/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {Button, Col, Container, Row} from "react-bootstrap"
import DefaultPFP from "~/images/profile.svg"
import React from "react"
import {UserContext} from "~/contexts"
import confirmAdapter from "~/adapters/auth/confirm"
import orgRequestAdapter from "~/adapters/orgRequest"
import styles from "./index.module.scss"
import {useHistory} from "react-router-dom"

export const UserDisplay: React.FC = () => {
    const history = useHistory()
    const {currentUser: user, setUser} = React.useContext(UserContext)

    return user === undefined ? (
        <Container>It looks like you&apos;ve been signed out</Container>
    ) : (
        <>
            <Row>
                <Col lg={2}>
                    <div className="px-4 my-3">
                        <img
                            loading="lazy"
                            src={DefaultPFP}
                            className={styles.pfp}
                            alt="Profile"
                        />
                    </div>
                </Col>
                <Col lg={6} className="d-flex flex-column justify-content-center">
                    <p className={styles.username}>
                        {user.username}
                        <span className="text-muted">#{user.uid.slice(0, 8)}</span>
                    </p>
                    <p className={`${styles.uid} text-muted`}>{user.uid}</p>
                </Col>
                <Col lg={4} className="d-flex flex-row align-items-center justify-content-end">
                    <Button variant="outline-primary" size="lg">
                        Edit
                    </Button>
                    <Button
                        size="lg"
                        variant="outline-danger"
                        className="mx-4"
                        onClick={async (): Promise<void> => {
                            await setUser(undefined)

                            return history.push("/")
                        }}
                    >
                        Logout
                    </Button>
                </Col>
            </Row>

            <Row className={`bg-primary ${styles.bar}`}>
                <Col xs={12}></Col>
            </Row>

            <Row>
                <Col xs={3} className="bg-lighter">
                    <ul className="list-unstyled text-dark px-4 py-5">
                        <li>Email: {user.email}</li>
                        <br />
                        <li>Username: {user.username}</li>
                        <br />
                        <li>UID (short): {user.uid.slice(0, 8)}</li>
                        {user.isOrganization ? undefined : (
                            <>
                                <br />
                                An organization? Apply to become an organization!
                                <br />
                                <Button
                                    variant="outline-primary"
                                    onClick={() => orgRequestAdapter(user)}
                                >
                                    Apply
                                </Button>
                            </>
                        )}
                        {user.isVerified ? undefined : (
                            <>
                                <br />
                                Resend verification email
                                <br />
                                <Button
                                    variant="outline-primary"
                                    onClick={() => confirmAdapter(user.idToken)}
                                >
                                    Verify
                                </Button>
                            </>
                        )}
                    </ul>
                </Col>
                <Col xs={9} className="px-gx">
                    <h1>Projects:</h1>
                    <p>Coming soon!</p>
                </Col>
            </Row>
        </>
    )
}

export default UserDisplay
