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
import "./Nav.scss"
import {
    Link,
    RouteComponentProps,
    withRouter
} from "react-router-dom"
import React from "react"

interface NavState {
    location?: string,
}

interface NavLinkProps {
    location: string,
    name: string,
}

@(withRouter as any)
export default class Nav extends React.Component<Partial<RouteComponentProps>, NavState> {

    public constructor (props: Partial<RouteComponentProps>) {
        super(props)

        this.state = {
            location: this.props.location?.pathname,
        }
    }

    public componentDidUpdate = (prevProps: RouteComponentProps): void => {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged()
        }
    }

    public onRouteChanged = (): void => {
        this.setState({location: this.props.location?.pathname})
    }

    private _srOnly = (): JSX.Element => <span className="sr-only">(current)</span>

    private _navLink = ({location, name}: NavLinkProps): JSX.Element => {
        const _location = this.state.location,
            SrOnly = this._srOnly

        return <li className="nav-item">
            <Link className={`nav-link ${_location === location ? "active" : ""}`} to={location}>
                {name} {location === _location ? <SrOnly/> : ""}
            </Link>
        </li>
    }

    private _navLinks = (): JSX.Element => {
        const NavLink = this._navLink,
            navValues: string[][] = [
                ["/", "Home"],
                ["/projects", "Projects"],
                ["/talents", "Talents"],
                ["/talentmakers", "Talentmakers"],
                ["/auth", "Sign Up"],
            ]

        return <ul className="navbar-nav">
            {navValues.map((val) => <NavLink
                key={`nav-link-${val[0]}`}
                location={val[0]}
                name={val[1]}
            />)}
        </ul>
    }

    public render = (): JSX.Element => {
        const NavLinks = this._navLinks

        return <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">
                <img src="images/logo.svg" alt="logo"/> talentmaker
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <NavLinks/>
            </div>
        </nav>
    }

}
