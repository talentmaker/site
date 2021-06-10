/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {Button, Col, Container, Row} from "react-bootstrap"
import DefaultPFP from "~/images/profile.svg"
import React from "react"
import UserContext from "~/contexts/userContext"
import notify from "~/utils/notify"
import orgRequestAdapter from "~/adapters/orgRequest"
import styles from "./index.module.scss"
import {useHistory} from "react-router-dom"

const makeOrgRequest = async (user: User): Promise<void> => {
    const data = await orgRequestAdapter(user)

    if (!(data instanceof Error)) {
        notify({
            title: "Successfully Made Request!",
            content: "Success! You have requested to become an organization!",
            icon: "account_box",
            iconClassName: "text-success",
        })
    }
}

export const UserDisplay: React.FC = () => {
    const history = useHistory()
    const {currentUser: user, setUser} = React.useContext(UserContext)
    const orgRequest = React.useCallback(makeOrgRequest, [])

    return user === undefined ? (
        <Container>It looks like you&apos;ve been signed out</Container>
    ) : (
        <>
            <Row>
                <Col lg={2}>
                    <div className="px-4 my-3">
                        <img src={DefaultPFP} className={styles.pfp} alt="Profile" />
                    </div>
                </Col>
                <Col lg={6} className="d-flex flex-column justify-content-center">
                    <p className={styles.username}>
                        {user.username}
                        <span className="text-muted">#{user.sub.slice(0, 8)}</span>
                    </p>
                    <p className={`${styles.sub} text-muted`}>{user.sub}</p>
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
                        <li>UID (short): {user.sub.slice(0, 8)}</li>
                        <br />
                        An organization? Apply to become an organization!
                        <br />
                        <Button
                            variant="outline-primary"
                            onClick={(): Promise<void> => orgRequest(user)}
                        >
                            Apply
                        </Button>
                    </ul>
                </Col>
                <Col xs={9}>
                    <h1>Projects:</h1>
                </Col>
            </Row>
        </>
    )
}

export default UserDisplay
