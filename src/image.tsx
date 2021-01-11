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

import DefaultImage from "./images/default.svg"
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
    shouldUseDefault?: boolean,

    /**
     * Image source, either from
     */
    src: string | string[],

    /**
     * If the image should use a spinner until the image is loader
     */
    shouldIncludeSpinner?: boolean,

    /**
     * Extra image classname
     */
    className?: string,

    /**
     * Extra styling
     */
    style?: React.CSSProperties,

    /**
     * Spinner component to show before the image loads
     */
    children?: React.ReactNode,
}

const Img: React.FC<Props> = (props) => {
    const images: string[] = typeof props.src === "string"
        ? [props.src]
        : props.src,

        // Current image index to use
        [currentIndex, setIndex] = React.useState(0),

        // If the image has loaded
        [didload, setLoad] = React.useState(false),

        /**
         * Handle an image error
         */
        onError = (): void => {
            if (images.length > currentIndex + 1) {
                setIndex(currentIndex + 1)
            }
        }

    if (props.shouldUseDefault !== false) { // If shouldUseDefault is undefined or true, append the default image
        images.push(DefaultImage)
    }

    return <>
        {didload ? undefined : props.children}
        <img
            alt="All backups failed"
            {...{
                ...props,
                children: undefined,
            }}
            src={images[currentIndex]}
            onError={onError}
            onLoad={(): void => setLoad(true)}
            style={props.style}
            className={`${didload ? "d-block" : "d-none"} ${props.className}`}
        />
    </>
}

/**
 * An image component which allows for backup images to be specified in case of
 * faliure, with the alt attribute last
 */
export const Image = React.memo(Img)

export default Image
