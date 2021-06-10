/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {
    NavLink as BsNavLink,
    Col,
    Container,
    NavItem,
    Navbar,
    NavbarBrand,
    Row,
} from "react-bootstrap"
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
            <NavItem>
                <BsNavLink
                    as={Link}
                    active={currentLocation.pathname === location}
                    className={styles.navLink}
                    to={location}
                >
                    {name}{" "}
                    {currentLocation.pathname === location ? (
                        <span className="visually-hidden">(current)</span>
                    ) : (
                        ""
                    )}
                </BsNavLink>
            </NavItem>
        ),
        [currentLocation.pathname],
    )

    const navIcon = React.useCallback(
        (location: string, iconName: string, displayName: string): JSX.Element => (
            <BsNavLink
                as={Link}
                active={currentLocation.pathname === location}
                className={styles.mobileNavLink}
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
            </BsNavLink>
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
        <div className={`${styles.mobileNav} bg-lighter`}>
            <NavLinks isMobile={true} />
            <span
                className={styles.mobileNavUnderline}
                style={{
                    left: getPageIndex() * (dimensions[0] / navLinkCount),
                }}
            />
        </div>
    ) : (
        <Navbar
            variant="light"
            expand="md"
            className={`${styles.navbar} bg-none d-none d-sm-block`}
        >
            <Container fluid>
                <Row className="w-100">
                    <Col md={1}>
                        <NavbarBrand as={Link} className={styles.navbarBrand} to="/">
                            <img src={Logo} alt="Talentmaker logo" title="Talentmaker" />
                        </NavbarBrand>
                    </Col>
                    <Col md={11} className={styles.navLinks}>
                        <div className={styles.navbarNav}>
                            <NavLinks />
                        </div>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    )
}

export default Nav
