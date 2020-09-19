/**
 * Talentmaker website
 *
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
 * @author Luke Zhang - luke-zhang-04.github.io
 *
 * @license GPL-3.0
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/* eslint-disable prefer-named-capture-group */
import * as yup from "yup"
import {Field, Form, Formik, FormikHelpers, useField} from "formik"
import {Link} from "react-router-dom"
import React from "react"
import authApi from "../utils/auth"

interface FormValues {
    name: string,
    email: string,
    password: string,
    password2: string,
    didagree: boolean,
}

interface FormProps {
    name: string,
    type: string,
    children?: JSX.Element,
    label: string,
}

export default class Reg extends React.Component {

    /**
     * Input field component
     * @param props - props for form
     */
    private static _input = (props: FormProps): JSX.Element => {
        const [field, meta] = useField<FormProps>(props),
            errorText = meta.error && meta.touched ? meta.error : ""

        let errorClass: string | undefined,
            feedback: JSX.Element | undefined

        if (errorText) {
            errorClass = "is-invalid"
            feedback = <div className="invalid-feedback">
                {errorText}
            </div>
        } else if (meta.touched) {
            errorClass = "is-valid"
            feedback = <div className="valid-feedback">
                Looks Good!
            </div>
        }

        return (
            <div className="input-group border-none">
                <div className="input-group-prepend">
                    <span className="input-group-text">{props.children ?? ""}</span>
                </div>
                <Field type={props.type} {...field} placeholder={props.label} className={`form-control ${errorClass ? errorClass : ""}`}/>
                {feedback}
            </div>
        )
    }

    /**
     * Checkbox component
     * @param param0 - typr and name of checkbox
     */
    private static _checkbox = ({type, name}: {[key: string]: string}): JSX.Element => {
        const [field, meta] = useField<{[key: string]: string}>({
            type,
            name,
        }),
            errorText = meta.error

        return (
            <div className="form-check">
                {/* eslint-disable-next-line */}
                <label className="form-check-label">
                    <Field type={type} className={`form-check-input ${errorText ? "is-invalid" : "is-valid"}`} {...field}/>
                    By Signing up, you agree to our <Link to="/legal">terms and conditions</Link> and <Link to="/privacy-policy">Privacy Policy</Link>.
                    <div className={errorText ? "invalid-feedback" : "valid-feedback"}>
                        {errorText ? errorText : "Looks Good!"}
                    </div>
                </label>
            </div>
        )
    }

    private static _isRequired = "is a required field."

    private _initialValues: FormValues = {
        name: "",
        email: "",
        password: "",
        password2: "",
        didagree: false,
    }

    /**
     * Validation schema with yup
     */
    private static _validationSchema = yup.object({
        name: yup.string()
            .required(`Username ${Reg._isRequired}`),
        email: yup.string()
            .required(`Email ${Reg._isRequired}`)
            .email(),
        password: yup.string()
            .required()
            .min(6),
        password2: yup.string()
            .oneOf([yup.ref("password"), undefined], "Passwords must match")
            .required()
    })

    private _validate = (values: FormValues): {} => {
        const errors: {[key: string]: string} = {}

        if (!values.didagree) {
            errors.didagree = "Make sure you have read and agree to the terms and conditions, and privacy policy."
        }

        return errors
    }

    private _submit = async (
        values: FormValues,
        {setSubmitting}: FormikHelpers<FormValues>
    ): Promise<void> => {
        setSubmitting(true)
        try {
            const user = await authApi.register(values.name, values.email, values.password)

            console.log("USER", user)
            alert("Success! You have been registered! Please confirm your email.")
        } catch (err) {
            if (err instanceof Error) {
                alert(`ERROR: ${err.message}`)
            } else {
                alert("ERROR: Unknown")
            }

            console.log(err)
        }

        setSubmitting(false)
    }

    public render = (): JSX.Element => (
        <>
            <Formik
                initialValues={this._initialValues}
                onSubmit={this._submit}
                validate={this._validate}
                validationSchema={Reg._validationSchema}
            >
                {({isSubmitting}): JSX.Element => (
                    <Form className="container">
                        <Reg._input name="name" type="name" label="Name">
                            <span className="material-icons">person</span>
                        </Reg._input>
                        <Reg._input name="email" type="email" label="Email">
                            <span className="material-icons">alternate_email</span>
                        </Reg._input>
                        <Reg._input name="password" type="password" label="Password">
                            <span className="material-icons">vpn_key</span>
                        </Reg._input>
                        <Reg._input name="password2" type="password" label="Confirm password">
                            <span className="material-icons">vpn_key</span>
                        </Reg._input>
                        <Reg._checkbox name="didagree" type="checkbox"/>

                        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                            Register
                        </button>
                    </Form>
                )}
            </Formik>
            <Link to="/auth?mode=login" className="text-center px-5 mt-3 ml-auto mr-auto d-block">Already Have an Account? Login!</Link>
        </>
    )

}
