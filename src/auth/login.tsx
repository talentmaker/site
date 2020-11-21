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

import "./auth.scss"
import {Field, Form, Formik, FormikHelpers, useField} from "formik"
import React from "react"
import authApi from "../utils/auth"

interface FormValues {
    name: string,
    password: string,
}

interface FormProps {
    label: string,
    name: string,
    type: string,
    placeholder?: string,
    children?: JSX.Element,
}

export default class Login extends React.Component {

    /**
     * Input field component
     * @param props - props for form
     */
    private static _input = (props: FormProps): JSX.Element => {
        const [field] = useField<FormProps>(props)

        return (
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">{props.children ?? ""}</span>
                </div>
                <Field
                    type={props.type}
                    {...field}
                    placeholder={props.placeholder || props.label}
                    className="form-control"
                />
            </div>
        )
    }

    private _initialValues: FormValues = {
        name: "",
        password: "",
    }

    private _submit = async (
        values: FormValues,
        {setSubmitting}: FormikHelpers<FormValues>
    ): Promise<void> => {
        setSubmitting(true)
        try {
            const user = await authApi.login(values.name, values.password)

            console.log("USER", user)
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
            >
                {({isSubmitting}): JSX.Element => (
                    <Form className="container">
                        <Login._input name="name" type="username" label="Username" placeholder="Username or Email">
                            <span className="material-icons">person</span>
                        </Login._input>
                        <Login._input name="password" type="password" label="Password">
                            <span className="material-icons">vpn_key</span>
                        </Login._input>

                        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                            Login
                        </button>
                    </Form>
                )}
            </Formik>
        </>
    )

}

