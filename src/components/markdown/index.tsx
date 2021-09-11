/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file markdown Render components
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {Table, TableCell} from "./table"
import {Anchor} from "./anchor"
import {BlockQuote} from "./blockquote"
import {CodeBlock} from "./syntaxHighlighter"
import DOMPurify from "dompurify"
import {Heading} from "./heading"
import React from "react"
import {Spinner} from "~/components/bootstrap"
import gfm from "remark-gfm" // Github Flavoured Markdown

const ReactMarkdown = React.lazy(() => import("react-markdown"))

const purifyMarkdown = (content: string): string =>
    DOMPurify.sanitize(content.replace(/\n>/giu, "\n\\>")).replace(/\n\\(&gt;|>)/giu, "\n>\n>")

export {EditableMarkdown} from "./editor"

export interface Props {
    /**
     * Markdown to render
     */
    children: string

    /**
     * If headings should include a link button
     */
    plainHeadings?: boolean
}

export const RenderMarkdown = (props: Props): ReturnType<React.FC> => {
    const renderers = {
        blockquote: BlockQuote,
        code: CodeBlock,
        heading: Heading,
        link: Anchor,
        table: Table,
        tableCell: TableCell,
    }

    if (props.plainHeadings === true) {
        Reflect.deleteProperty(renderers, "heading")
    }

    return (
        <React.Suspense
            fallback={<Spinner color="primary" size="25vw" className="my-5" centered />}
        >
            <ReactMarkdown plugins={[[gfm]]} renderers={renderers} allowDangerousHtml>
                {purifyMarkdown(props.children)}
            </ReactMarkdown>
        </React.Suspense>
    )
}

export default RenderMarkdown
