/**
 * Talentmaker website
 *
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 */

export const url = process.env.NODE_ENV === "development"
    ? "http://localhost:3333"
    : ""

export default Object.freeze({
    url,
})
