/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {Button, Col, Row} from "react-bootstrap"
import {Link} from "react-router-dom"
import ProblemSolvingSvg from "./problemSolving.svg"
import React from "react"
import UserContext from "~/contexts/userContext"
import styles from "./home.module.scss"

export const Home: React.FC = () => {
    const {currentUser: user} = React.useContext(UserContext)

    return (
        <div className={`${styles.landingPage} pt-3`}>
            <Row className={styles.row}>
                <Col md={6} className={`text ${styles.text}`}>
                    <h1>Talentmaker</h1>
                    <p>
                        Encouraging and empowering students to pursure their future endeavours and
                        career asprirations with real, hands on, and rewarding project experience.
                    </p>
                    <Button as={Link} to="/competitions" variant="primary">
                        <span className="material-icons">developer_board</span> Competitions
                    </Button>
                    {user ? undefined : (
                        <Button as={Link} to="/auth" variant="accent" className="ms-md-3">
                            <span className="material-icons">person</span> Make an account!
                        </Button>
                    )}
                </Col>
                <Col md={6} className="image">
                    <img className="w-100" src={ProblemSolvingSvg} alt="problem solving" />
                </Col>
            </Row>
        </div>
    )
}

export default Home
