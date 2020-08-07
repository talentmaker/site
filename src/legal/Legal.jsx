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
import Gpl from "./Gpl"
import React from "react"

const Legal = () => (
    <div className="container">
        <h1>Talentmaker Website Terms of Use</h1>
        <p>Copyright (C) 2020 <a href="https://luke-zhang-04.github.io/">Luke Zhang</a>, <a href="https://github.com/ethanlim04">Ethan Lim</a>, and Talentmaker</p>
        <p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License (below) for more details.</p>
        <Gpl/>
        <p>END OF TERMS AND CONDITIONS</p>
    </div>
)

export default Legal
