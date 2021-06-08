/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {Field, useField} from "formik"
import type React from "react"

type InputProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
> & {
    name: string
    type: string
    label: string
    shouldShowValidFeedback?: boolean
    placeholder?: string
}

export const Input: React.FC<InputProps> = ({
    children,
    shouldShowValidFeedback = true,
    ...props
}) => {
    const [field, meta] = useField<Omit<InputProps, "children" | "shouldShowValidFeedback">>(props)
    const errorText = meta.error && meta.touched ? meta.error : ""

    let errorClass: string | undefined
    let feedback: JSX.Element | undefined

    if (errorText) {
        errorClass = "is-invalid"
        feedback = <div className="invalid-feedback">{errorText}</div>
    } else if (meta.touched) {
        errorClass = "is-valid"
        feedback = shouldShowValidFeedback ? (
            <div className="valid-feedback">Looks Good!</div>
        ) : undefined
    }

    return (
        <div className="input-group border-none br-0">
            <div className="input-group-prepend">
                <span className="input-group-text">{children ?? ""}</span>
            </div>
            <Field
                {...props}
                {...field}
                placeholder={props.placeholder ?? props.label}
                className={`${props.className ?? ""} ${errorClass ?? ""} form-control`}
            />
            {feedback}
        </div>
    )
}

export default Input
