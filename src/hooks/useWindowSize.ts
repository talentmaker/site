/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import React from "react"

type Dimensions = [
    innerWidth: number,
    innerHeight: number,
    outerWidth: number,
    outerHeight: number,
]

export const useWindowSize = (): Dimensions => {
    const [dimensions, setDimensions] = React.useState<Dimensions>([
        window.innerWidth,
        window.innerHeight,
        window.outerWidth,
        window.outerHeight,
    ])

    const dimensionsSetter = () => {
        setDimensions([
            window.innerWidth,
            window.innerHeight,
            window.outerWidth,
            window.outerHeight,
        ])
    }

    React.useEffect(() => {
        window.addEventListener("resize", dimensionsSetter)

        return () => {
            window.removeEventListener("resize", dimensionsSetter)
        }
    }, [])

    return dimensions
}

export default useWindowSize
