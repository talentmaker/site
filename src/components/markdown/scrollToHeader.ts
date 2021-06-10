/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file allows Scrolling to header
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

/**
 * Scrolls to a header with the same contents as a hash
 *
 * @param hash - Url hash such as #header-name
 * @param containerName - Name of the container to search, query selector style
 */
export const scrollToHeader = (hash: string, containerName = ".markdown-container"): void => {
    const container = document.querySelector(containerName)

    if (container) {
        const headers = "h1, h2, h3, h4, h5, h6"

        for (const header of container.querySelectorAll(headers)) {
            if (header instanceof HTMLElement) {
                const content = header.innerText.trim().replace(/ /gu, "-").toLowerCase()
                const wantedContent = hash.slice(1)

                if (content === wantedContent) {
                    return header.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                        inline: "nearest",
                    })
                }
            }
        }
    }
}

export default scrollToHeader
