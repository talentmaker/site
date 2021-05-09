/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import type {Props} from "../components/bootstrap/toast"
import React from "react"
import {Toast} from "../components/bootstrap"
import {appRef} from ".."

enum Time {
    Second = 1000,
}

interface Params {
    /**
     * Contents of the toast body
     */
    content?: React.ReactNode

    /**
     * Name of icon
     *
     * @default error
     */
    icon?: string

    /**
     * `className` for icon
     */
    iconClassName?: string

    /**
     * Toast title
     */
    title?: string

    /**
     * Time to put on the side of the toast E.g "now", "1 minute ago"
     */
    time?: string | number

    /**
     * If aria-live should be assertive
     *
     * @default false
     */
    assertive?: boolean
}

const currentNotification = React.createRef<HTMLDivElement>()

/**
 * Create notification toast
 *
 * @param params - Parameters of notification
 * @param timeout - Time the notification should stay on in seconds @default 5
 */
export const notify = (params: Params | Error, timeout = 5): void => {
    const {current: app} = appRef

    if (app !== null) {
        const removeNotification = (): void => {
            if (currentNotification?.current) {
                app.setState({notification: undefined})
            }
        }
        const props: Props =
            params instanceof Error
                ? {
                      title: params.name,
                      icon: "report_problem",
                      iconClassName: "text-danger",
                      reference: currentNotification,
                      onClick: removeNotification,
                  }
                : {
                      ...params,
                      reference: currentNotification,
                      onClick: removeNotification,
                  }

        app.setState({
            notification: React.createElement(
                Toast,
                props,
                params instanceof Error ? params.message : params.content,
            ),
        })

        setTimeout(removeNotification, timeout * Time.Second)
    }
}

export default notify
