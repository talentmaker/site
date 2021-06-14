/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {Toast as BsToast, Button} from "react-bootstrap"
import DatePlus from "@luke-zhang-04/dateplus"
import React from "react"

enum Time {
    Second = 1000,
}

export interface Props {
    /**
     * Contents of the toast body
     */
    children?: React.ReactNode

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
     * Reference to the toast div
     */
    reference?:
        | ((instance: HTMLDivElement | null) => void)
        | React.RefObject<HTMLDivElement>
        | null

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

    /**
     * Handle button click on close
     */
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const getTimeFromSeconds = (time: number): string => {
    const date = DatePlus.secondsToHours(time)

    if (date.hours > 0) {
        return `${date.hours} hour${date.hours > 1 ? "s" : ""}, ${date.minutes} minute${
            date.minutes > 1 ? "s" : ""
        } ago`
    } else if (date.minutes > 0) {
        return `${date.minutes} minute${date.minutes > 1 ? "s" : ""}, ${date.seconds} second${
            date.seconds > 1 ? "s" : ""
        } ago`
    }

    return `${date.seconds} second${date.seconds > 1 ? "s" : ""} ago`
}

export const Toast: React.FC<Props> = ({
    children,
    icon,
    iconClassName,
    reference,
    title,
    assertive,
    ...props
}) => {
    const [shouldShow, setShouldShow] = React.useState(true)
    const [time, setTime] = React.useState(
        typeof props.time === "string" ? Number(props.time) : props.time ?? 0,
    )
    const intervalId = React.useRef<number>()

    React.useEffect(() => {
        const interval = setInterval((): void => {
            setTime((_time) => _time + 1)
        }, Time.Second)

        intervalId.current = Number(`${interval}`)

        return () => {
            clearInterval(intervalId.current)
        }
    }, [])

    return shouldShow ? (
        <BsToast
            show={shouldShow}
            className="toast-fixed"
            aria-live={assertive ? "assertive" : "polite"}
            aria-atomic="true"
            ref={reference}
        >
            {/* Do these with direct classNames */}
            <div className="toast-header text-dark bg-light">
                <span className={`material-icons me-2 ${iconClassName ?? ""}`}>
                    {icon ?? "error"}
                </span>
                <strong className="me-auto">{title}</strong>
                <small className="text-muted">{getTimeFromSeconds(time)}</small>
                <Button
                    type="button"
                    variant="close"
                    className="text-lighter"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                    onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
                        setShouldShow(false)

                        props.onClick?.(event)
                    }}
                />
            </div>
            <BsToast.Body>{children}</BsToast.Body>
        </BsToast>
    ) : null
}

export default Toast
