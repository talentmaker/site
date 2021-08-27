/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import type {NotificationType} from "~/components/notifications"
import React from "react"

export interface Context {
    notifications: {[timestamp: number]: NotificationType | Error}
    addNotification: (notification: NotificationType | Error) => void
    removeNotification: (id: number) => void
}

export const NotificationContext = React.createContext<Context>({
    notifications: [],
    addNotification: () => {},
    removeNotification: () => {},
})

export default NotificationContext
