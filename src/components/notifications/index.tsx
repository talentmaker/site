/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {NotificationContext} from "~/contexts"
import React from "react"
import ReactDOM from "react-dom"
import {Toast} from "../bootstrap"
import type {Props as ToastProps} from "../bootstrap/toast"
import {secsToMs} from "@luke-zhang-04/dateplus"
import styles from "./styles.module.scss"

export interface NotificationType
    extends Pick<ToastProps, "icon" | "iconClassName" | "title" | "hideTime" | "assertive"> {
    /**
     * Contents of the toast body
     */
    content?: React.ReactNode
}

const toastRoot = document.getElementById("toast-root")

if (!toastRoot) {
    throw new Error("Toast root is not defined")
}

const hideTimeSecs = 10
const hideTime = secsToMs(hideTimeSecs)

export const Notifications: React.FC<{
    notifications: {[timestamp: number]: NotificationType | Error}
}> = ({notifications}) => {
    const {removeNotification} = React.useContext(NotificationContext)

    return ReactDOM.createPortal(
        <div className={styles.toastContainer}>
            {Object.entries(notifications).map(([key, notification]) => {
                const onClick = () => removeNotification(Number(key))
                const props: ToastProps =
                    notification instanceof Error
                        ? {
                              title: notification.name,
                              icon: "report_problem",
                              iconClassName: "text-danger",
                          }
                        : {
                              ...notification,
                          }

                setTimeout(onClick, hideTime)

                return (
                    <Toast
                        {...{onClick, hideTime: hideTimeSecs, ...props}}
                        key={`notification-${key}`}
                    >
                        {notification instanceof Error
                            ? notification.message
                            : notification.content}
                    </Toast>
                )
            })}
        </div>,
        toastRoot,
    )
}
