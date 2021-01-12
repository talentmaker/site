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

import React from "react"

interface Props {

    /**
     * The spinner colour. Must be a theme colour
     * @default ""
     */
    color?: string,

    /**
     * Spinner type
     * @default "border"
     */
    type?: "border" | "grow",

    /**
     * Extra classname for the spinner
     */
    className?: string,

    /**
     * Extra styling for the spinner
     */
    style?: React.CSSProperties,

    /**
     * If the spinner should be small
     */
    small?: boolean,

    /**
     * If spinner should be centred in a container
     */
    centered?: boolean,

    /**
     * The width of the spinner with a CSS unit
     */
    size?: string,
}

/**
 * Bootstrap spinner
 * @param props - props for spinner
 * @see {@link https://getbootstrap.com/docs/5.0/components/spinners}
 */
export const Spinner: React.FC<Props> = (props) => {
    // Spinner color
    const color = props.color
            ? `text-${props.color}`
            : "",

        // Classname for a small spinner
        size = props.small
            ? "-sm"
            : "",

        // Style object
        style = props.style ?? {}

    if (props.size) {
        style.width = props.size
        style.height = props.size
    }

    if (props.centered) {
        return <div className="d-flex justify-content-center h-100 align-items-center">
            <div
                className={`spinner-${props.type ?? "border"}${size} ${color} ${props.className ?? ""}`}
                style={style}
            >
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    }

    return <div
        className={`spinner-${props.type ?? "border"}${size} ${color} ${props.className ?? ""}`}
        style={style}
    >
        <span className="visually-hidden">Loading...</span>
    </div>
}

export default Spinner
