/**
 * Talentmaker website
 *
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 * @file image component which allows for backup a image(s) to be specified
 */

import DefaultImage from "../images/default.svg"
import React from "react"

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
}

const Img: React.FC<Props> = (props) => {
    const images: string[] = typeof props.src === "string"
        ? [props.src]
        : props.src

    // Current image index to use
    const [currentIndex, setIndex] = React.useState(0)

    // If the image has loaded
    const [didLoad, setLoad] = React.useState(false)

    if (props.shouldUseDefault !== false) { // If shouldUseDefault is undefined or true, append the default image
        images.push(DefaultImage)
    }

    return <>
        {didLoad ? undefined : props.children}
        <img
            alt="All backups failed"

            {...{
                ...props,
                children: undefined,
            }}

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

            className={`${didLoad ? "d-block" : "d-none"} ${props.className}`}
        />
    </>
}

/**
 * An image component which allows for backup images to be specified in case of
 * faliure, with the alt attribute last
 */
export const Image = React.memo(Img)

export default Image
