/**
 * Talentmaker website
 *
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 */

import "./auth.scss"
import {Field, Form, Formik, FormikHelpers, useField} from "formik"
import {History} from "history"
import React from "react"
import UserContext from "../userContext"
import notify from "../notify"
import {url} from "../globals"
import {useHistory} from "react-router-dom"

interface FormValues {
    email: string,
    password: string,
}

interface FormProps {
    label: string,
    name: string,
    type: string,
    placeholder?: string,
    children?: JSX.Element,
}

interface LoginProps {
    history: History<unknown>["push"],
}

class Login extends React.Component<LoginProps> {

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
        email: "",
        password: "",
    }

    private _handleError = (err: unknown): void => {
        console.error(err)

        if (
            err instanceof Error ||
                typeof err === "object" &&
                typeof (err as {[key: string]: unknown}).message === "string"
        ) {
            notify({
                title: "Error",
                icon: "report_problem",
                iconClassName: "text-danger",
                content: `ERROR: ${(err as {[key: string]: unknown}).message as string}`,
            })
        } else {
            notify({
                title: "Error",
                icon: "report_problem",
                iconClassName: "text-danger",
                content: `ERROR: ${JSON.stringify(err)}`,
            })
        }
    }

    private _submit = async (
        values: FormValues,
        {setSubmitting}: FormikHelpers<FormValues>,
        setUser: (user?: {[key: string]: unknown} | null)=> Promise<void>,
    ): Promise<void> => {
        const {history} = this.props

        setSubmitting(true)

        try {
            const response = await fetch(
                    `${url}/auth/login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            email: values.email,
                            password: values.password,
                        }),
                    },
                ),
                data = await response.json() as {[key: string]: unknown}

            if (response.status === 200) {
                await setUser(data)

                setSubmitting(false)

                return history("/")
            }
            throw data

        } catch (err: unknown) {
            this._handleError(err)
        }

        setSubmitting(false)
    }

    public render = (): JSX.Element => <UserContext.Consumer>
        {({setUserFromUnknown: setUser}): JSX.Element => <Formik
            initialValues={this._initialValues}
            onSubmit={(values, helpers): Promise<void> => (
                this._submit(values, helpers, setUser)
            )}
        >
            {({isSubmitting}): JSX.Element => (
                <Form className="container">
                    <Login._input name="email" type="Email" label="Email" placeholder="Email">
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
        </Formik>}
    </UserContext.Consumer>

}

const LoginWithHistory = (): JSX.Element => {
    const history = useHistory(),
        {push: changeHistory} = history

    return <Login history={changeHistory}/>
}

export default LoginWithHistory
