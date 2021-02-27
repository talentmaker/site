/**
 * Talentmaker website
 *
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 */
import "./home.scss"
import type {CognitoUser} from "../utils/cognito"
import {Link} from "react-router-dom"
import Logo from "../images/logo.svg"
import ProblemSolvingSvg from "./problemSolving.svg"
import React from "react"
import UserContext from "../userContext"

interface Props {
    user?: CognitoUser,
}

class HomeComponent extends React.Component<Props> {

    private _landingPage = (): JSX.Element => <div className="landing-page pt-4 pt-md-0">
        <div className="row">
            <div className="col-12 col-md-6 text">
                <img src={Logo} alt="talentmaker logo" className="w-25 d-block d-md-none"/>
                <h1>Talentmaker</h1>
                <p>Encouraging and empowering students to pursure their future endeavours and career asprirations with real, hands on, and rewarding project experience.</p>
                <Link to="/competitions" className="btn btn-primary mb-3 mb-md-0">
                    <span className="material-icons-outlined">view_list</span> Competitions
                </Link>
                {
                    this.props.user
                        ? undefined
                        : <Link to="/auth" className="btn btn-accent ml-0 ml-md-3 d-none d-md-inline-block">
                            <span className="material-icons">person</span> Make an account!
                        </Link>
                }
            </div>
            <div className="col-md-6 image">
                <img className="w-100" src={ProblemSolvingSvg} alt="problem solving"/>
            </div>
        </div>
    </div>

    public render = (): JSX.Element => <>
        {this._landingPage()}
    </>

}

export const Home = (): JSX.Element => <UserContext.Consumer>
    {({currentUser: user}): JSX.Element => <HomeComponent
        user={user ?? undefined}
    />}
</UserContext.Consumer>

export default Home
