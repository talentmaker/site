/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file markdown Render components
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */
import "./blockquote.scss"
import type React from "react"

type Props = {
    children: JSX.Element
}

export const BlockQuote: React.FC<Props> = (props) => (
    <blockquote className="bg-light py-3">{props.children}</blockquote>
)

export default BlockQuote
