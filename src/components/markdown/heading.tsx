/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file markdown Render components
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import Anchor from "./anchor"
import React from "react"
import styles from "./heading.module.scss"

type Props = {
    level: number
    children:
        | string
        | {
              props: {
                  children: string
                  value: string
              }
          }[]
}

export const Heading = (props: Props): JSX.Element => {
    let content: string | undefined
    const {children} = props

    if (typeof children === "string") {
        content = children
    } else if (typeof children[0]?.props.value === "string") {
        content = children[0].props.value
    }

    return content ? (
        <div className="position-relative">
            <Anchor
                href={`#${content.trim().replace(/ /gu, "-").toLowerCase()}`}
                className={`${styles.headerLink} d-inline-block`}
            >
                <span className="material-icons">link</span>
            </Anchor>
            {React.createElement(`h${props.level}`, null, content)}
        </div>
    ) : (
        React.createElement(`h${props.level}`, null, props.children)
    )
}

export default Heading
