/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import type {Tooltip} from "bootstrap"

/**
 * Bootstrap brought in through a CDN
 */
declare const bootstrap: typeof import("bootstrap/")

/* eslint-disable one-var */
/**
 * Is a placement type
 */
const isPlacement = (
        placement: string | (() => void) | null,
    ): placement is Tooltip.Options["placement"] =>
        placement instanceof Function ||
        (placement !== null && ["auto", "top", "bottom", "left", "right"].includes(placement)),
    /**
     * From an element, get the tooltip attributes
     */
    getAttributesFromElement = (element: Element): Partial<Tooltip.Options> => {
        const placementAttr = element.getAttribute("data-bs-placement"),
            placement: Tooltip.Options["placement"] = isPlacement(placementAttr)
                ? placementAttr
                : "auto"

        return {
            placement,
        }
    }

/* eslint-enable one-var */

/**
 * Initializes tooltips
 */
export const initTooltips = (): void => {
    Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]') ?? []).forEach(
        (element) => {
            const tooltip = new bootstrap.Tooltip(element, getAttributesFromElement(element))

            element.addEventListener("click", () => {
                tooltip.hide()
            })
        },
    )
}

export default initTooltips
