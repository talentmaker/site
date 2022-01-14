/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import "./home.scss"
import {Button, Col, Row} from "react-bootstrap"
import Img from "~/components/elements/image"
import {Link} from "react-router-dom"
import LoadingDots from "~/components/loadingDots"
import MaterialIcons from "~/components/materialIcons"
import ProblemSolvingSvg from "~/images/problemSolving.svg"
import React from "react"
import UserContext from "~/contexts/userContext"
import styles from "./home.module.scss"

const Content = React.lazy(() => import("./content"))

export const Home: React.FC = () => {
    const {currentUser: user} = React.useContext(UserContext)

    return (
        <>
            <div className={`${styles.landingPage} mt-3`}>
                <Row className={styles.row}>
                    <Col md={6} className={`text ${styles.text}`}>
                        <h1>Talentmaker</h1>
                        <p className={styles.bigText}>
                            Encouraging and empowering students to pursure their future endeavours
                            and career asprirations with real, hands on, and rewarding project
                            experience.
                        </p>
                        <div>
                            <Button as={Link} to="/competitions" variant="primary">
                                <MaterialIcons icon="developer_board" /> Competitions
                            </Button>
                            {user ? undefined : (
                                <Button as={Link} to="/auth" variant="accent" className="ms-md-3">
                                    <MaterialIcons icon="person" /> Make an account!
                                </Button>
                            )}
                        </div>
                    </Col>
                    <Col md={6} className={`image ${styles.image}`}>
                        <Img className="w-100" src={ProblemSolvingSvg} alt="problem solving">
                            <Img.DefaultSpinner />
                        </Img>
                    </Col>
                </Row>
            </div>
            <React.Suspense fallback={<LoadingDots medium />}>
                <Content />
            </React.Suspense>
        </>
    )
}

export default Home
