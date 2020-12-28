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
/* eslint-disable prefer-named-capture-group */
import * as yup from "yup"
import {Field, Form, Formik, FormikHelpers, useField} from "formik"
import {Link} from "react-router-dom"
import React from "react"
import {url} from "../globals"

interface FormValues {
    username: string,
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
        username: "",
        email: "",
        password: "",
        password2: "",
        didagree: false,
    }

    /**
     * Validation schema with yup
     */
    private static _validationSchema = yup.object({
        username: yup.string()
            .required(`Username ${Reg._isRequired}`)
            .max(32),
        email: yup.string()
            .required(`Email ${Reg._isRequired}`)
            .email(),
        password: yup.string()
            .required()
            .min(8)
            .matches(/[0-9]/gu, "Password must include at least 1 number")
            .matches(/[a-z]/gu, "Password must include at least 1 lowercase letter")
            .matches(/[A-Z]/gu, "Password must include at least 1 uppercase letter"),
        password2: yup.string()
            .oneOf([yup.ref("password"), undefined], "Passwords must match")
            .required(),
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
        {setSubmitting}: FormikHelpers<FormValues>,
    ): Promise<void> => {
        setSubmitting(true)
        try {
            const response = await fetch(
                    `${url}/auth/register`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: values.username,
                            email: values.email,
                            password: values.password,
                        }),
                    },
                ),
                data = await response.json() as {[key: string]: unknown}

            if (response.status === 200) {
                alert("Success! You have been registered! Please confirm your email.")
            } else {
                throw data
            }
        } catch (err) {
            console.error(err)

            if (err instanceof Error || typeof err.message === "string") {
                alert(`ERROR: ${err.message as string}`)
            } else {
                alert(`ERROR: ${JSON.stringify(err)}`)
            }
        }

        setSubmitting(false)
    }

    public render = (): JSX.Element => <Formik
        initialValues={this._initialValues}
        onSubmit={this._submit}
        validate={this._validate}
        validationSchema={Reg._validationSchema}
    >
        {({isSubmitting}): JSX.Element => (
            <Form className="container">
                <Reg._input name="username" type="username" label="Username">
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

}
