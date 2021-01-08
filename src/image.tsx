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
}

const Img: React.FC<Props> = (props) => {
    const images: string[] = typeof props.src === "string"
        ? [props.src]
        : props.src,

        // Current image index to use
        [currentIndex, setIndex] = React.useState(0),

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

    return <img
        alt="All backups failed"
        {...props}
        src={images[currentIndex]}
        onError={onError}
    />
}

/**
 * An image component which allows for backup images to be specified in case of
 * faliure, with the alt attribute last
 */
export const Image = React.memo(Img)

export default Image
