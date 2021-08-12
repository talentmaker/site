/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

/**
 * Bootstrap brought in through a CDN
 */
declare const bootstrap: typeof import("bootstrap/")

/**
 * Initializes tooltips
 */
export const initPopovers = (): void => {
    for (const element of document.querySelectorAll('[data-bs-toggle="popover"]')) {
        new bootstrap.Popover(element)
    }
}

export default initPopovers
