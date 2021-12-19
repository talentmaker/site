/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import {Field, useField} from "formik"
import {InputGroup} from "react-bootstrap"
import React from "react"

type InputProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
> & {
    name: string
    type: string
    label: string
    shouldShowValidFeedback?: boolean
    placeholder?: string
    shouldShowLabel?: boolean
    noFeedback?: boolean
}

export const Input: React.FC<InputProps> = ({
    children,
    shouldShowValidFeedback = true,
    shouldShowLabel = false,
    noFeedback = false,
    ...props
}) => {
    const [field, meta] = useField<Omit<InputProps, "children" | "shouldShowValidFeedback">>(props)
    const errorText = meta.error && meta.touched ? meta.error : ""

    let errorClass: string | undefined
    let feedback: JSX.Element | undefined

    if (!noFeedback) {
        if (errorText) {
            errorClass = "is-invalid"
            feedback = <div className="invalid-feedback">{errorText}</div>
        } else if (meta.touched) {
            errorClass = "is-valid"
            feedback = shouldShowValidFeedback ? (
                <div className="valid-feedback">Looks Good!</div>
            ) : undefined
        }
    }

    const id = React.useMemo(
        () => `${props.name.split(" ").join("-")}-${props.label.split(" ").join("-")}`,
        [props.name, props.label],
    )

    return (
        <>
            {shouldShowLabel ? <label htmlFor={id}>{props.label}</label> : undefined}
            <InputGroup className={`border-none br-0 ${shouldShowLabel ? "mb-3" : ""}`}>
                <InputGroup.Text>{children ?? ""}</InputGroup.Text>
                <Field
                    {...props}
                    {...field}
                    id={id}
                    placeholder={props.placeholder ?? props.label}
                    className={`${props.className ?? ""} ${errorClass ?? ""} form-control`}
                />
                {feedback}
            </InputGroup>
        </>
    )
}

export default Input
