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

import Logo from "../images/logo.svg"
import React from "react"

interface FooterProps {
    title: string,
    links: [string, string][],
}

/**
 * Footer links
 * @param param0 - props for footer
 */
const FooterLinks = ({title, links}: FooterProps): JSX.Element => (
    <div className="col-md-4 mb-md-0 mb-3">
        <h5 className="text-uppercase">{title}</h5>
        <ul className="list-unstyled">
            {links.map((link, index) => (
                <li key={`footer-link-${title}-${index}`}>
                    <a href={link[0]}>{link[1]}</a>
                </li>
            ))}
        </ul>
    </div>
)

export const Footer = (): JSX.Element => <footer className="page-footer font-small bg-darker text-light pt-4">
    <div className="container-fluid text-center text-md-left">
        <div className="row">
            <div className="col-md-4 mt-md-0 mt-3">
                <h5 className="text-uppercase">Talentmaker</h5>
                <img src={Logo} alt="logo" className="w-100"/>
            </div>

            <hr className="clearfix w-100 d-md-none pb-0"/>

            <FooterLinks
                title="Links"
                links={[
                    ["#", "Link A"],
                    ["#", "Link B"],
                    ["#", "Link C"],
                    ["#", "Link D"],
                ]}
            />

            <FooterLinks
                title="Links"
                links={[
                    ["#", "Link A"],
                    ["#", "Link B"],
                    ["#", "Link C"],
                    ["#", "Link D"],
                ]}
            />
        </div>
    </div>

    <div className="footer-copyright text-center py-3">Copyright © 2020:{" "}
        <a href="https://luke-zhang-04.github.io/">Luke Zhang</a>,{" "}
        <a href="https://github.com/ethanlim04">Ethan Lim</a>,
    </div>

</footer>

export default Footer
