/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as adapters from "~/adapters"
import {Button, Col, Container, Row} from "react-bootstrap"
import {Link, useHistory} from "react-router-dom"
import DefaultPFP from "~/images/profile.svg"
import GridItem from "~/components/gridItem"
import MetaTags from "~/components/metaTags"
import React from "react"
import {Spinner} from "~/components/bootstrap"
import {UserContext} from "~/contexts"
import {arrayToChunks} from "@luke-zhang-04/utils"
import styles from "./index.module.scss"
import {useAdapter} from "~/hooks"

export const UserDisplay: React.FC<{uid: string}> = ({uid}) => {
    const history = useHistory()
    const {currentUser, setUser} = React.useContext(UserContext)
    const {data: user, error} = useAdapter(() => adapters.user.getWithProjects(uid), undefined, [
        uid,
    ])

    const projects = user?.projects

    if (error !== undefined) {
        return <Container>{error.toString()}</Container>
    } else if (user === undefined) {
        return <Spinner color="primary" size="25vw" className="my-5" centered />
    }

    return (
        <>
            <MetaTags title={user.username} description={`${user.username}'s profile`} />
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
                {user.uid === currentUser?.uid && (
                    <Col lg={4} className="d-flex flex-row align-items-center justify-content-end">
                        <Button variant="outline-primary" size="lg" as={Link} to="/profile/edit">
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
                )}
            </Row>

            <Row className={`bg-primary ${styles.bar}`}>
                <Col xs={12} />
            </Row>

            <Row>
                <Col xs={3} className="bg-lighter">
                    <ul className="list-unstyled text-dark px-4 py-5">
                        {user.uid === currentUser?.uid && (
                            <>
                                <li>Email: {currentUser.email}</li>
                                <br />
                            </>
                        )}
                        <li>Username: {user.username}</li>
                        <br />
                        <li>UID (short): {user.uid.slice(0, 8)}</li>
                        {user.uid === currentUser?.uid && !currentUser.isOrganization && (
                            <>
                                <br />
                                An organization? Apply to become an organization!
                                <br />
                                <Button
                                    variant="outline-primary"
                                    onClick={() => adapters.organization.request(currentUser)}
                                >
                                    Apply
                                </Button>
                            </>
                        )}
                        {user.uid === currentUser?.uid && !currentUser.isVerified && (
                            <>
                                <br />
                                Resend verification email
                                <br />
                                <Button
                                    variant="outline-primary"
                                    onClick={() => adapters.auth.confirm(currentUser.idToken)}
                                >
                                    Verify
                                </Button>
                            </>
                        )}
                    </ul>
                </Col>
                <Col xs={9} className="p-tm-gx">
                    <h1>Projects:</h1>
                    {projects?.length ? (
                        arrayToChunks(projects).map((row, index) => (
                            <Row key={`profile-project-row-${index}`} className="g-3">
                                {row.map((project, index2) => (
                                    <GridItem
                                        key={`comp-item-0-${index}-${index2}`}
                                        imageURL={project.coverImageURL ?? undefined}
                                        title={project.name ?? ""}
                                        link={{to: `/project/${project.id}`, text: "Details"}}
                                    />
                                ))}
                            </Row>
                        ))
                    ) : (
                        <p>No projects yet</p>
                    )}
                </Col>
            </Row>
        </>
    )
}

export default UserDisplay
