/**
 * Talentmaker website
 *
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 * @file markdown render components
 */

import {Table, TableCell} from "./table"
import {BlockQuote} from "./blockquote"
import {CodeBlock} from "./syntaxHighlighter"
import DOMPurify from "dompurify"
import React from "react"
import ReactMarkdown from "react-markdown"
import gfm from "remark-gfm" // Github Flavoured Markdown

const purifyMarkdown = (content: string): string => DOMPurify.sanitize(
    content.replace(
        /\n>/gui,
        "\n\\>",
    ),
).replace(
    /\n\\(&gt;|>)/gui,
    "\n>\n>",
)

interface Props {

    /**
     * Markdown to render
     */
    children: string,
}

export const RenderMarkdown: React.FC<Props> = (props) => (
    <ReactMarkdown
        plugins={[[gfm]]}
        renderers={{
            blockquote: BlockQuote,
            code: CodeBlock,
            table: Table,
            tableCell: TableCell,
        }}
        allowDangerousHtml
    >
        {purifyMarkdown(props.children)}
    </ReactMarkdown>
)

export default RenderMarkdown
