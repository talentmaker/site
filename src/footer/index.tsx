/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import "./index.scss"
import type {CognitoUser} from "../utils/cognito"
import {Link} from "react-router-dom"
import React from "react"

/**
 * Footer links
 *
 * @param param0 - Props for footer
 */
const FooterLinks = ({links}: {links: [dest: string, name: string][]}): JSX.Element => (
    <>
        {links.map((link, index) => (
            <>
                <a key={`footer-link-${index}`} href={link[0]}>
                    {link[1]}
                </a>
                {index + 1 < links.length ? <p className="my-0 mx-3">&#x2022;</p> : undefined}
            </>
        ))}
    </>
)

type User = CognitoUser | null | undefined

const linkProps = {
    target: "_blank",
    rel: "noopener noreferred",
}

/* eslint-disable jsx-a11y/anchor-has-content */
export const Footer: React.FC<{user: User}> = (props): JSX.Element => (
    <footer className="page-footer font-small bg-lighter text-dark pt-4 pb-3">
        <div className="row social-media-icons">
            <a
                {...linkProps}
                href="https://www.youtube.com/channel/UCltJw7oSTdHDio806LztCzQ"
                className="bi-youtube"
            ></a>
            <a
                {...linkProps}
                href="https://www.linkedin.com/in/talent-maker-group/"
                className="bi-linkedin"
            ></a>
        </div>

        <div className="row pages">
            <FooterLinks
                links={[
                    ["/competitions", "Competitions"],
                    ["/talents", "Talents"],
                    ["/talentmakers", "Talentmakers"],
                    props.user ? ["/profile", "Your Profile"] : ["/auth", "Sign Up"],
                ]}
            />
        </div>

        <div className="text-center">
            <Link to="/legal">Terms and conditions</Link>
            <span className="my-0 mx-3">&#x2022;</span>
            <Link to="/privacy-policy">Privacy Policy</Link>
        </div>

        <div className="text-center mt-3">
            <a href="https://github.com/Luke-zhang-04/talentmaker-site" {...linkProps}>
                Repository
            </a>
        </div>

        <div className="footer-copyright text-center">
            Copyright © 2020 - 2021:{" "}
            <a href="https://luke-zhang-04.github.io" target="_blank" rel="noopener noreferrer">
                Luke Zhang
            </a>
            ,{" "}
            <a href="https://github.com/ethanlim04" target="_blank" rel="noopener noreferrer">
                Ethan Lim
            </a>
            .
        </div>
    </footer>
)
/* eslint-enable jsx-a11y/anchor-has-content */

export default Footer
