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
import {Link} from "react-router-dom"
import type React from "react"

export const Checkbox: React.FC<{name: string; type: string}> = ({type, name}) => {
    const [field, {error: errorText}] = useField<{name: string; type: string}>({
        type,
        name,
    })

    return (
        <div className="form-check">
            {/* eslint-disable-next-line */}
            <label className="form-check-label">
                <Field
                    type={type}
                    className={`form-check-input ${errorText ? "is-invalid" : "is-valid"}`}
                    {...field}
                />
                By Signing up, you agree to our <Link to="/legal">terms and conditions</Link> and{" "}
                <Link to="/privacy-policy">Privacy Policy</Link>.
                <div className={errorText ? "invalid-feedback" : "valid-feedback"}>
                    {errorText ? errorText : "Looks Good!"}
                </div>
            </label>
        </div>
    )
}

export default Checkbox
