/**
 * Talentmaker website
 * 
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
 * @author Luke Zhang - luke-zhang-04.github.io 
 *
 * @license GPL-3.0
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import "./home.scss"
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
                <img className="w-100" src="images/problemSolving.svg" alt="problem solving"/>
            </div>
        </div>
    </div>

    public constructor (props: {}) {
        super(props)

        window.onresize = (): void => this.setState({
            viewport: [window.innerWidth, window.innerHeight],
        })

        this.state = {
            viewport: [window.innerWidth, window.innerHeight],
        }
    }

    public render = (): JSX.Element => <>
        <Home._landingPage/>
    </>

}
