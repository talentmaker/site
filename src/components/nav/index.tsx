/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {Link, useLocation} from "react-router-dom"
import {BreakPoints} from "~/globals"
import Logo from "~/images/logo.svg"
import React from "react"
import UserContext from "~/contexts/userContext"
import routes from "./routes"
import styles from "./index.module.scss"

const navLinkCount = Math.min(routes.mobile.length, routes.desktop.length)

export const Nav: React.FC = () => {
    const currentLocation = useLocation()
    const [dimensions, setDimensions] = React.useState<[width: number, height: number]>([
        window.innerWidth,
        window.innerHeight,
    ])
    const {currentUser: user} = React.useContext(UserContext)

    React.useEffect(() => {
        window.addEventListener("resize", () => {
            setDimensions([window.innerWidth, window.innerHeight])
        })

        return () => {
            window.removeEventListener("resize", () => {
                setDimensions([window.innerWidth, window.innerHeight])
            })
        }
    }, [])

    const NavLink = React.useCallback<React.FC<{location: string; name: string}>>(
        ({location, name}): JSX.Element => (
            <li className="nav-item">
                <Link
                    className={`nav-link ${styles.navLink} ${
                        currentLocation.pathname === location ? "active" : ""
                    }`}
                    to={location}
                >
                    {name}{" "}
                    {currentLocation.pathname === location ? (
                        <span className="visually-hidden">(current)</span>
                    ) : (
                        ""
                    )}
                </Link>
            </li>
        ),
        [currentLocation.pathname],
    )

    const navIcon = React.useCallback(
        (location: string, iconName: string, displayName: string): JSX.Element => (
            <Link
                className={`${styles.mobileNavLink} ${
                    currentLocation.pathname === location ? "active" : ""
                }`}
                to={location}
            >
                <span
                    className={
                        currentLocation.pathname === location
                            ? "material-icons"
                            : "material-icons-outlined"
                    }
                >
                    {iconName}
                </span>
                <p>{displayName}</p>
            </Link>
        ),
        [currentLocation.pathname],
    )

    const NavLinks = React.useCallback<React.FC<{isMobile?: boolean}>>(
        ({isMobile}) =>
            isMobile ? (
                <>
                    {routes.mobile.map((properties) => (
                        <div
                            key={`mobile-name-item-${properties.toString()}`}
                            className={styles.mobileNavItemContainer}
                        >
                            {typeof properties[0] === "string"
                                ? navIcon(...(properties as [string, string, string]))
                                : navIcon(
                                      ...((user === null || user === undefined
                                          ? properties[1]
                                          : properties[0]) as [string, string, string]),
                                  )}
                        </div>
                    ))}
                </>
            ) : (
                <ul className="navbar-nav">
                    {routes.desktop.map((val) => {
                        if (typeof val[0] === "string") {
                            return (
                                <NavLink
                                    key={`nav-link-${val[0]}`}
                                    location={val[0] as string}
                                    name={val[1] as string}
                                />
                            )
                        } else if (user === null || user === undefined) {
                            return (
                                <NavLink
                                    key={`nav-link-${val[0]}`}
                                    location={val[1][0]}
                                    name={val[1][1]}
                                />
                            )
                        }

                        return (
                            <NavLink
                                key={`nav-link-${val[0]}`}
                                location={val[0][0]}
                                name={val[0][1]}
                            />
                        )
                    })}
                </ul>
            ),
        [currentLocation.pathname, user],
    )

    const getPageIndex = React.useCallback(() => {
        for (const [index, value] of routes.mobile.entries()) {
            if (typeof value[0] === "string") {
                if (currentLocation.pathname === value[0]) {
                    return index
                }
            } else {
                if (
                    currentLocation.pathname ===
                    (user === null || user === undefined ? value[1][0] : value[0][0])
                ) {
                    return index
                }
            }
        }

        return 0
    }, [currentLocation.pathname])

    return dimensions[0] <= BreakPoints.Md ? (
        <div className={`mobile-nav ${styles.mobileNav} bg-lighter`}>
            <NavLinks isMobile={true} />
            <span
                className={`mobile-nav-underline ${styles.mobileNavUnderline}`}
                style={{
                    left: getPageIndex() * (dimensions[0] / navLinkCount),
                }}
            />
        </div>
    ) : (
        <nav
            className={`navbar ${styles.navbar} navbar-expand-md navbar-light bg-none d-none d-sm-block`}
        >
            <div className="container-fluid">
                <div className="row w-100">
                    <div className="col-md-1">
                        <Link className={`navbar-brand ${styles.navbarBrand}`} to="/">
                            <img src={Logo} alt="Talentmaker logo" title="Talentmaker" />
                        </Link>
                    </div>
                    <div className={`col-md-11 nav-links ${styles.navLinks}`}>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div
                            className={`collapse navbar-collapse ${styles.navbarNav}`}
                            id="navbarNav"
                        >
                            <NavLinks />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Nav
