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
import "./blockquote.scss"
import React from "react"

type Props = {
    children: JSX.Element
}

export const BlockQuote: React.FC<Props> = (props) => (
    <blockquote className="bg-light container py-3">{props.children}</blockquote>
)

export default BlockQuote
