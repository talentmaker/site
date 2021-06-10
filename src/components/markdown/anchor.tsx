/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file markdown Render components
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import type React from "react"
import scrollToHeader from "./scrollToHeader"

type Props = React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
>

/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
export const Anchor: React.FC<Props> = (props) => {
    if (props.href?.slice(0, 1) === "#") {
        return (
            <a
                {...props}
                {...(props.href?.[0] === "#"
                    ? {}
                    : {
                          // External link force noopener, noreferrer, and blank target
                          rel: "noopener noreferrer",
                          target: "_blank",
                      })}
                /**
                 * Scroll to the header specified in href if the header is already in the location hash
                 */
                onClick={(event): void => {
                    if (props.href?.[0] === "#") {
                        scrollToHeader(props.href)
                    }

                    props.onClick?.(event)
                }}
            >
                {props.children}
            </a>
        )
    }

    return <a {...props}>{props.children}</a>
}
/* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */

export default Anchor
