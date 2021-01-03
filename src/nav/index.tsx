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
import "./Nav.scss"
import {
    Link,
    RouteComponentProps,
    withRouter,
} from "react-router-dom"
import Logo from "../images/logo.svg"
import React from "react"
import UserContext from "../userContext"

interface NavState {
    location?: string,
}

interface NavLinkProps {
    location: string,
    name: string,
}

interface NavLinkShowProps {
    isloggedin: boolean,
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

    private _srOnly = (): JSX.Element => <span className="visually-hidden">(current)</span>

    private _navLink = ({location, name}: NavLinkProps): JSX.Element => {
        const _location = this.state.location,
            SrOnly = this._srOnly

        return <li className="nav-item">
            <Link className={`nav-link ${_location === location ? "active" : ""}`} to={location}>
                {name} {location === _location ? <SrOnly/> : ""}
            </Link>
        </li>
    }

    private _navLinks = ({isloggedin}: NavLinkShowProps): JSX.Element => {
        const NavLink = this._navLink,
            navValues: string[][] = [
                ["/", "Home"],
                ["/competitions", "Competitions"],
                ["/talents", "Talents"],
                ["/talentmakers", "Talentmakers"],
                isloggedin ? ["/profile", "Profile"] : ["/auth", "Sign Up"],
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

        return <UserContext.Consumer>
            {({currentUser}): JSX.Element => <nav className="navbar navbar-expand-lg navbar-dark bg-none">
                <Link className="navbar-brand" to="/">
                    <img src={Logo} alt="logo"/> talentmaker
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <NavLinks isloggedin={currentUser !== null && currentUser !== undefined}/>
                </div>
            </nav>}
        </UserContext.Consumer>
    }

}
