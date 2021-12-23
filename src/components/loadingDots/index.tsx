/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import type React from "react"
import styles from "./index.module.scss"

export const LoadingDots: React.FC<{
    className?: string
    large?: boolean
    medium?: boolean
    small?: boolean
}> = ({className = "", large, small}) => {
    let size = styles.medium

    if (large) {
        size = styles.large
    } else if (small) {
        size = styles.small
    }

    return <div className={`${styles.loadingDots} ${className} ${size} text-center`}> .</div>
}

export default LoadingDots
