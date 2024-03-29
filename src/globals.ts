/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

/**
 * API URL
 */
export const url =
    process.env.NODE_ENV === "development" ? "http://localhost:3333" : "https://api.talentmaker.ca"

export enum BreakPoints {
    Xs = 0,
    Sm = 576,
    Md = 768,
    Lg = 992,
    Xl = 1200,
    Xxl = 1400,
}

export default Object.freeze({
    BreakPoints,
    url,
})
