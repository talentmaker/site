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

import DatePlus from "@luke-zhang-04/dateplus"
import React from "react"


export interface Props {

    /**
     * Contents of the toast body
     */
    children?: React.ReactNode,

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
     * Reference to the toast div
     */
    reference?: string
        | ((instance: HTMLDivElement | null)=> void)
        | React.RefObject<HTMLDivElement>
        | null,

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

    /**
     * Handle button click on close
     */
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>)=> void,
}

interface State {
    shouldShow: boolean,
    time: number | string,
}

export class Toast extends React.PureComponent<Props, State> {

    private static _getTimeFromSeconds = (time: number): string => {
        const date = DatePlus.secondsToHours(time)

        if (date.hours > 0) {
            return `${date.hours} hour${date.hours > 1 ? "s" : ""}, ${date.minutes} minute${date.minutes > 1 ? "s" : ""} ago`
        } else if (date.minutes > 0) {
            return `${date.minutes} minute${date.minutes > 1 ? "s" : ""}, ${date.seconds} second${date.seconds > 1 ? "s" : ""} ago`
        }

        return `${date.seconds} second${date.seconds > 1 ? "s" : ""} ago`
    }

    public constructor (props: Props) {
        super(props)

        this.state = {
            shouldShow: true,
            time: props.time ?? 0,
        }
    }

    public componentDidMount = (): void => {
        if (typeof this.state.time === "number") {
            const interval = setInterval((): void => {
                const {time} = this.state

                if (typeof time === "number") {
                    this.setState({time: time + 1})
                }
            }, 1000)

            this._intervalId = Number(`${interval}`)
        }
    }

    public componentWillUnmount = (): void => {
        clearInterval(this._intervalId)
    }

    private _intervalId?: number

    /**
     * Bootstrap toast
     */
    private _toast = (): JSX.Element => <div
        className={`toast ${this.state.shouldShow ? "show" : "hide"} bg-darker toast-fixed`}
        aria-live={this.props.assertive ? "assertive" : "polite"}
        aria-atomic="true"
        ref={this.props.reference}
    >
        <div className="toast-header text-darker bg-light">
            <span className={`material-icons mr-2 ${this.props.iconClassName ?? ""}`}>
                {this.props.icon ?? "error"}
            </span>
            <strong className="mr-auto">{this.props.title}</strong>
            <small className="text-muted">{
                typeof this.state.time === "number"
                    ? Toast._getTimeFromSeconds(this.state.time)
                    : this.state.time
            }</small>
            <button
                type="button"
                className="btn-close text-darker"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={(event): void => {
                    this.setState({shouldShow: false})

                    this.props.onClick?.(event)
                }}
            ></button>
        </div>
        <div className="toast-body">
            {this.props.children}
        </div>
    </div>

    public render = (): JSX.Element => (
        this.state.shouldShow
            ? <this._toast/>
            : <></>
    )

}

export default Toast
