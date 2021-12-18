/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file some Closures for detecting changed in query string
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

history.pushState = ((func) =>
    function pushState(this: unknown, ...args: Parameters<typeof history.pushState>) {
        const ret = func.apply(this, args)

        window.dispatchEvent(new Event("pushstate"))
        window.dispatchEvent(new Event("locationchange"))

        return ret
    })(history.pushState)

history.replaceState = ((func) =>
    function replaceState(this: unknown, ...args: Parameters<typeof history.replaceState>) {
        const ret = func.apply(this, args)

        window.dispatchEvent(new Event("replacestate"))
        window.dispatchEvent(new Event("locationchange"))

        return ret
    })(history.replaceState)

window.addEventListener("popstate", () => {
    window.dispatchEvent(new Event("locationchange"))
})

export {}
