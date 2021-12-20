/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file provides Meta tags so they can be rendered with a pre-renderer
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import Helmet from "react-helmet"
import type React from "react"

type MetaTagData = {
    title?: string | null
    description?: string | null
    exactTitle?: boolean
    statusCode?: string | number | null
    image?: string | null
}

/**
 * Component which renders meta tags to <head> default meta tags, Opengraph, and Twitter
 *
 * @warn put these after rendering the main content; putting it at the beginning can cause weird
 *  render refresh glitches and force the VDOM to completely rerender
 */
export const MetaTags: React.FC<MetaTagData> = ({
    title,
    description,
    image,
    exactTitle = false,
    statusCode,
    children,
}) => {
    const metaAttrs: React.DetailedHTMLProps<
        React.MetaHTMLAttributes<HTMLMetaElement>,
        HTMLMetaElement
    >[] = [
        {property: "url", content: window.location.href},
        {property: "og:url", content: window.location.href},
        {property: "twitter:url", content: window.location.href},
    ]

    const suffix = exactTitle ? " - Talentmaker" : ""

    if (title) {
        metaAttrs.push({property: "og:title", content: `${title}${suffix}`})
        metaAttrs.push({property: "twitter:title", content: `${title}${suffix}`})
    }
    if (description) {
        metaAttrs.push({property: "description", content: description})
        metaAttrs.push({property: "og:description", content: description})
        metaAttrs.push({property: "twitter:description", content: description})
    }
    if (image) {
        metaAttrs.push({property: "og:image", content: image})
        metaAttrs.push({property: "twitter:image", content: image})
    }
    if (statusCode !== undefined && statusCode !== null) {
        metaAttrs.push({property: "render:status_code", content: statusCode.toString()})
    }

    return (
        <Helmet meta={metaAttrs} title={title ? `${title}${suffix}` : undefined}>
            {children}
        </Helmet>
    )
}

export default MetaTags
