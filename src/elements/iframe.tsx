/**
 * Talentmaker website
 *
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 * @file iframe element with spinner
 */

import React from "react"

type IframeProps = React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLIFrameElement>,
    HTMLIFrameElement
>

type Props = IframeProps & {

    /**
     * If the iframe should use a spinner until the iframe is loaded
     *
     *
     */
    shouldIncludeSpinner?: boolean

    /**
     * Spinner component to show before the iframe loads
     */
    children?: React.ReactNode
}

export const IFrameComponent: React.FC<Props> = (props) => {
    const [didLoad, setLoad] = React.useState(false)

    return <>
        {didLoad ? undefined : props.children}
        <iframe
            {...{
                ...props,
                children: undefined,
            }}

            onLoad={(event): void => {
                setLoad(true)

                return props.onLoad?.(event)
            }}

            onError={(event): void => {
                setLoad(true)

                return props.onError?.(event)
            }}

            className={`${didLoad ? "d-block" : "d-none"} ${props.className}`}
            title={props.title ?? `YouTube video from ${props.src}`}
        />
    </>
}

export const IFrame = React.memo(IFrameComponent)

export default IFrame
