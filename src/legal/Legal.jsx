/**
 * Talentmaker website
 *
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
 * @license BSD-3-Clause
 * @author Luke Zhang - luke-zhang-04.github.io
 */
import Bsd3 from "./Bsd3"
import React from "react"

const Legal = () => (
    <div className="container">
        <h1>Talentmaker Website Terms of Use</h1>
        <p>Copyright (C) 2020 <a href="https://luke-zhang-04.github.io/">Luke Zhang</a>, <a href="https://github.com/ethanlim04">Ethan Lim</a>, and Talentmaker</p>
        <p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the BSD 3 Clause License (below) for more details.</p>
        <Bsd3/>
        <p>END OF TERMS AND CONDITIONS</p>
    </div>
)

export default Legal
