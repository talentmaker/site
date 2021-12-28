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

export const MaterialIcons: React.FC<
    {
        icon: string
        type?: "outlined" | "round" | "shart" | "two-tone" | "filled"
    } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
> = ({icon, className = "", type, ...props}) => (
    <span
        {...props}
        className={`material-icons${type && type !== "filled" ? `-${type}` : ""} ${className} ${
            styles.icon
        }`}
        data-icon={icon}
    />
)

export default MaterialIcons
