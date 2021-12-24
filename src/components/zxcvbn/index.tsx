/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import React from "react"
import zxcvbn from "zxcvbn"

export const Zxcvbn: React.FC<{password: string; className?: string}> = ({
    password,
    className,
}) => {
    const {
        score,
        feedback: {warning, suggestions},
        crack_times_display: {online_no_throttling_10_per_second: crackTime},
    } = React.useMemo(() => zxcvbn(password), [password])

    if (!password) {
        return <div />
    }

    const suggestionsList = (
        <ul>
            {suggestions.map((suggestion) => (
                <li key={suggestion} className="text-success">
                    {suggestion}
                </li>
            ))}
        </ul>
    )

    switch (score) {
        case 0:
            return (
                <div className={className}>
                    <p>
                        Your password is <b className="text-danger">very weak</b>, it will only
                        take <b className="text-danger">{crackTime}</b> to crack.
                    </p>
                    {warning && <p className="text-warning">{warning}</p>}
                    {suggestions && suggestionsList}
                </div>
            )
        case 1:
            return (
                <div className={className}>
                    <p>
                        Your password is <b className="text-danger">weak</b>, it will only take{" "}
                        <b className="text-danger">{crackTime}</b> to crack.
                    </p>
                    {warning && <p className="text-warning">{warning}</p>}
                    {suggestions && suggestionsList}
                </div>
            )

        case 2:
            return (
                <div className={className}>
                    <p>
                        Your password is <b className="text-warning">mediocre</b>, it will take{" "}
                        <b className="text-warning">{crackTime}</b> to crack.
                    </p>
                    {warning && <p className="text-warning">{warning}</p>}
                    {suggestions && suggestionsList}
                </div>
            )

        case 3:
            return (
                <div className={className}>
                    <p>
                        Your password is <b className="text-success">strong</b>, it will take{" "}
                        <b className="text-success">{crackTime}</b> to crack.
                    </p>
                    {warning && <p className="text-warning">{warning}</p>}
                    {suggestions && suggestionsList}
                </div>
            )

        default:
            return (
                <div className={className}>
                    <p>
                        Your password is <b className="text-success">crazy strong</b>, it will take{" "}
                        <b className="text-success">{crackTime}</b> to crack.
                    </p>
                    {warning && <p className="text-warning">{warning}</p>}
                    {suggestions && suggestionsList}
                </div>
            )
    }
}

export default Zxcvbn
