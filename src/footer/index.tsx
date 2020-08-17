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

import React from "react"

const Footer = (): JSX.Element => <footer className="page-footer font-small bg-dark text-light pt-4">
    <div className="container-fluid text-center text-md-left">
        <div className="row">
            <div className="col-md-4 mt-md-0 mt-3">
                <h5 className="text-uppercase">Talentmaker</h5>
                <img src="images/logo.svg" alt="logo" className="w-100"/>
            </div>

            <hr className="clearfix w-100 d-md-none pb-0"/>

            <div className="col-md-4 mb-md-0 mb-3">
                <h5 className="text-uppercase">Links</h5>
                <ul className="list-unstyled">
                    <li><a href="#!">Link 1</a></li>
                    <li><a href="#!">Link 2</a></li>
                    <li><a href="#!">Link 3</a></li>
                    <li><a href="#!">Link 4</a></li>
                </ul>
            </div>

            <div className="col-md-4 mb-md-0 mb-3">
                <h5 className="text-uppercase">Links</h5>
                <ul className="list-unstyled">
                    <li><a href="#!">Link 1</a></li>
                    <li><a href="#!">Link 2</a></li>
                    <li><a href="#!">Link 3</a></li>
                    <li><a href="#!">Link 4</a></li>
                </ul>
            </div>
        </div>
    </div>

    <div className="footer-copyright text-center py-3">Copyright © 2020:{" "}
        <a href="https://luke-zhang-04.github.io/">Luke Zhang</a>,{" "}
        <a href="https://github.com/ethanlim04">Ethan Lim</a>,
    </div>

</footer>

export default Footer
