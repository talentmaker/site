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
import DOMPurify from "dompurify"

export {BlockQuote} from "./blockquote"
export {CodeBlock} from "./syntaxHighlighter"
export {Table, TableCell} from "./table"

export const purifyMarkdown = (content: string): string => (
    DOMPurify.sanitize(content.replace(
        /\n>/gui,
        "\n\\>",
    )).replace(
        /\n\\&gt;/gui,
        "\n>\n>",
    )
)
