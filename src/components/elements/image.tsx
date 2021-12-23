/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file image Component which allows for backup a image(s) to be specified
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import DefaultImage from "~/images/default.svg"
import React from "react"
import {Spinner} from "~/components/bootstrap"

type ImgProps = React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
>

type Props = ImgProps & {
    /**
     * If the default grey square should be included last in the queue
     *
     * @default true
     */
    shouldUseDefault?: boolean

    /**
     * Image source, either from
     */
    src: string | string[]

    /**
     * Spinner component to show before the image loads
     */
    children?: React.ReactNode

    /**
     * If image should be lazy-loaded
     *
     * @default false
     */
    lazy?: boolean
}

/**
 * An image component which allows for backup images to be specified in case of faliure, with the
 * alt attribute last
 */
export const Img: React.FC<Props> & {DefaultSpinner: React.FC} = ({
    lazy,
    src,
    shouldUseDefault,
    children,
    ...props
}) => {
    const images: string[] = typeof src === "string" ? [src] : src
    // Current image index to use
    const [currentIndex, setIndex] = React.useState(0)
    // If the image has loaded
    const [didLoad, setLoad] = React.useState(false)

    if (shouldUseDefault !== false) {
        // If shouldUseDefault is undefined or true, append the default image
        images.push(DefaultImage)
    }

    return (
        <>
            {didLoad ? undefined : children}
            <img
                alt="All backups failed"
                {...props}
                loading={lazy ? "lazy" : "eager"}
                src={images[currentIndex]}
                onError={(event): void => {
                    if (images.length > currentIndex + 1) {
                        setIndex(currentIndex + 1)
                    }

                    return props.onError?.(event)
                }}
                onLoad={(event): void => {
                    setLoad(true)

                    return props.onLoad?.(event)
                }}
                className={`${didLoad ? "d-block" : "d-none"} ${props.className ?? ""}`}
            />
        </>
    )
}

export const DefaultSpinner = () => <Spinner color="primary" size="6rem" centered />

Img.DefaultSpinner = DefaultSpinner

export default Img
