/**
 * Talentmaker website
 *
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 * @file markdown render components
 */

import "./heading.scss"
import Anchor from "./anchor"
import React from "react"

type Props = {
    level: number,
    children: string | {
        props: {
            children: string,
            value: string,
        },
    }[],
}

export const Heading = (props: Props): JSX.Element => {
    let content: string | undefined
    const {children} = props

    if (typeof children === "string") {
        content = children
    } else if (typeof children[0]?.props.value === "string") {
        content = children[0].props.value
    }

    return content
        ? <div className="position-relative">
            <Anchor
                href={`#${content
                    .trim()
                    .replace(/ /gu, "-")
                    .toLowerCase()
                }`}
                className="header-link d-inline-block"
            >
                <span className="material-icons">link</span>
            </Anchor>
            {React.createElement(`h${props.level}`, null, content)}
        </div>
        : React.createElement(`h${props.level}`, null, props.children)
}

export default Heading
