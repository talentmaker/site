/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {Container} from "react-bootstrap"
import React from "react"
import WIP from "~/images/under-construction.svg"

export const Talents: React.FC = () => (
    <Container fluid>
        <h1>Under Construction</h1>
        <img loading="lazy" className="w-100" src={WIP} alt="under construction" />
    </Container>
)

export default Talents
