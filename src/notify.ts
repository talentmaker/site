/**
 * Talentmaker website
 *
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 */

import type {Props} from "./bootstrap/toast"
import React from "react"
import {Toast} from "./bootstrap"
import {appRef} from "."
import {unmountComponentAtNode} from "react-dom"

interface Params {

    /**
     * Contents of the toast body
     */
    content?: React.ReactNode,

    /**
     * Name of icon
     * @default "error"
     */
    icon?: string,

    /**
     * `className` for icon
     */
    iconClassName?: string,

    /**
     * Toast title
     */
    title?: string,

    /**
     * Time to put on the side of the toast
     * E.g "now", "1 minute ago"
     */
    time?: string | number,

    /**
     * If aria-live should be assertive
     * @default false
     */
    assertive?: boolean,
}

const currentNotification = React.createRef<HTMLDivElement>()

/**
 * Create notification toast
 * @param params - parameters of notification
 */
export const notify = (params: Params, timeout = 15_000): void => {
    const {current: app} = appRef

    console.log({app})

    if (app !== null) {
        const removeNotification = (): void => {
                if (currentNotification && currentNotification.current) {
                    app.setState({notification: undefined})

                    try {
                        unmountComponentAtNode(currentNotification.current)
                        // eslint-disable-next-line
                    } catch {}
                }
            },
            props: Props = {
                ...params,
                reference: currentNotification,
                onClick: removeNotification,
            }

        console.log("Setting state")

        app.setState({
            notification: React.createElement(Toast, props, params.content),
        })

        setTimeout(removeNotification, timeout)
    }
}

export default notify
