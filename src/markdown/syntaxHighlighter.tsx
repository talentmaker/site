/**
 * Talentmaker website
 *
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 */
import React from "react"

type Props = {
    value: string,
    language?: string,
}

/* eslint-disable react/prop-types */
export const CodeBlock: React.FC<Props> = ({language, value}) => (
    <pre className={`language-${language}`}>
        <code className={`language-${language}`}>
            {value}
        </code>
    </pre>
)
/* eslint-disable react/prop-types */

export default CodeBlock
