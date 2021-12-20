/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file entry Point for this react application including the app component
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {Route as DefaultRoute} from "react-router-dom"
import Helmet from "react-helmet"
import type React from "react"

export const Route: React.FC<DefaultRoute["props"] & {title?: string}> = ({title, ...props}) =>
    title ? (
        <>
            <Helmet
                title={title}
                meta={[
                    {property: "og:title", content: title},
                    {property: "twitter:title", content: title},
                ]}
            />
            <DefaultRoute {...props} />
        </>
    ) : (
        <>
            <Helmet
                title={props.component?.displayName}
                meta={[
                    {property: "og:title", content: props.component?.displayName},
                    {property: "twitter:title", content: props.component?.displayName},
                ]}
            />
            <DefaultRoute {...props} />
        </>
    )

export default Route
