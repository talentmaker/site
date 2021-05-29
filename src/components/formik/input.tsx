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

interface InputProps {
    name: string
    type: string
    label: string
}

export const Input: React.FC<InputProps> = (props) => {
    const [field, meta] = useField<InputProps>(props)
    const errorText = meta.error && meta.touched ? meta.error : ""

    let errorClass: string | undefined
    let feedback: JSX.Element | undefined

    if (errorText) {
        errorClass = "is-invalid"
        feedback = <div className="invalid-feedback">{errorText}</div>
    } else if (meta.touched) {
        errorClass = "is-valid"
        feedback = <div className="valid-feedback">Looks Good!</div>
    }

    return (
        <div className="input-group border-none br-0">
            <div className="input-group-prepend">
                <span className="input-group-text">{props.children ?? ""}</span>
            </div>
            <Field
                type={props.type}
                {...field}
                placeholder={props.label}
                className={`form-control ${errorClass ?? ""}`}
            />
            {feedback}
        </div>
    )
}

export default Input
