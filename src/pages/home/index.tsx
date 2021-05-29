/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */
import "./home.scss"
import {Link} from "react-router-dom"
import ProblemSolvingSvg from "./problemSolving.svg"
import React from "react"
import UserContext from "../../contexts/userContext"

interface Props {
    user?: User
}

class HomeComponent extends React.Component<Props> {
    private _landingPage = (): JSX.Element => (
        <div className="landing-page">
            <div className="row">
                <div className="col-md-6 text">
                    <h1>Talentmaker</h1>
                    <p>
                        Encouraging and empowering students to pursure their future endeavours and
                        career asprirations with real, hands on, and rewarding project experience.
                    </p>
                    <Link to="/competitions" className="btn btn-primary">
                        <span className="material-icons">developer_board</span> Competitions
                    </Link>
                    {this.props.user ? undefined : (
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

    public render = (): JSX.Element => <>{this._landingPage()}</>
}

export const Home = (): JSX.Element => (
    <UserContext.Consumer>
        {({currentUser: user}): JSX.Element => <HomeComponent user={user} />}
    </UserContext.Consumer>
)

export default Home
