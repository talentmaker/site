/**
 * Talentmaker website
 *
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 */
import "./home.scss"
import ProblemSolvingSvg from "./problemSolving.svg"
import React from "react"

interface HomeState {
    viewport: [number, number],
}

export default class Home extends React.Component<{}, HomeState> {

    private static _searchBar = (): JSX.Element => <div className="searchbar-container">
        <input className="form-control searchbar" type="text" placeholder="Find a Project" aria-label="search"/>
        <button className="btn input-btn">Get Started</button>
    </div>

    private static _landingPage = (): JSX.Element => <div className="landing-page">
        <div className="row">
            <div className="col-md-6 text">
                <h1>A student project community and technology consulting company</h1>
                <p>Encouraging and empowering students for their future adventures, gaining real project experience, and building career asprirations.</p>
                <Home._searchBar/>
            </div>
            <div className="col-md-6 image">
                <img className="w-100" src={ProblemSolvingSvg} alt="problem solving"/>
            </div>
        </div>
    </div>

    public constructor (props: {}) {
        super(props)

        this.state = {
            viewport: [window.innerWidth, window.innerHeight],
        }

        window.onresize = (): void => this.setState({
            viewport: [window.innerWidth, window.innerHeight],
        })

    }

    public render = (): JSX.Element => <>
        <Home._landingPage/>
    </>

}
