/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {NotificationContext} from "~/contexts"

import React from "react"
import {createError} from "~/utils"

export class ErrorBoundary extends React.Component {
    public componentDidCatch = (error: unknown): void => {
        this.context.addNotification(createError(error))
    }

    static contextType = NotificationContext

    context!: React.ContextType<typeof NotificationContext>

    public render = (): React.ReactNode => this.props.children
}

export default ErrorBoundary
