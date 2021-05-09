/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import * as yup from "yup"
import {competitionSchema} from "./competition"

export const competitionsSchema = yup.array(competitionSchema).required()

export type Competitions = typeof competitionsSchema.__outputType
