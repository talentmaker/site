/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {Link} from "react-router-dom"
import ProblemSolvingSvg from "./problemSolving.svg"
import React from "react"
import UserContext from "~/contexts/userContext"
import styles from "./home.module.scss"

export const Home: React.FC = () => {
    const {currentUser: user} = React.useContext(UserContext)

    return (
        <div className={styles.landingPage}>
            <div className={`row ${styles.row}`}>
                <div className={`col-md-6 text ${styles.text}`}>
                    <h1>Talentmaker</h1>
                    <p>
                        Encouraging and empowering students to pursure their future endeavours and
                        career asprirations with real, hands on, and rewarding project experience.
                    </p>
                    <Link to="/competitions" className="btn btn-primary">
                        <span className="material-icons">developer_board</span> Competitions
                    </Link>
                    {user ? undefined : (
                        <Link to="/auth" className="btn btn-accent ms-3">
                            <span className="material-icons">person</span> Make an account!
                        </Link>
                    )}
                </div>
                <div className="col-md-6 image">
                    <img className="w-100" src={ProblemSolvingSvg} alt="problem solving" />
                </div>
            </div>
        </div>
    )
}

export default Home
