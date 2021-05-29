/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import "./index.scss"
import * as yup from "yup"
import {Form, Formik, FormikHelpers} from "formik"
import {Input} from "../../formik"
import React from "react"
import {Spinner} from "../../bootstrap"
import UserContext from "../../../contexts/userContext"
import loginAdapter from "../../../adapters/auth/login"
import {useHistory} from "react-router-dom"

interface FormValues {
    email: string
    password: string
}

const validationSchema = yup.object({
    email: yup.string().required("Email is required").email("Email must be a valid email"),
    password: yup.string().required("Password is required"),
})

const initialValues: FormValues = {
    email: "",
    password: "",
}

export const Login = (): JSX.Element => {
    const {push: changeHistory} = useHistory()
    const submit = React.useCallback(
        async (
            values: FormValues,
            {setSubmitting}: FormikHelpers<FormValues>,
            setUser: (user?: {[key: string]: unknown} | null) => Promise<void>,
        ): Promise<void> => {
            setSubmitting(true)

            const data = await loginAdapter(values.email, values.password)

            if (!(data instanceof Error)) {
                await setUser(data)

                setSubmitting(false)

                return changeHistory("/")
            }

            setSubmitting(false)
        },
        [],
    )

    return (
        <UserContext.Consumer>
            {({setUserFromUnknown: setUser}): JSX.Element => (
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, helpers): Promise<void> => submit(values, helpers, setUser)}
                    validationSchema={validationSchema}
                    validateOnMount
                >
                    {({isSubmitting}): JSX.Element => (
                        <Form className="container-fluid">
                            <Input name="email" type="Email" label="Email">
                                <span className="material-icons">person</span>
                            </Input>
                            <Input name="password" type="password" label="Password">
                                <span className="material-icons">vpn_key</span>
                            </Input>

                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Spinner inline> </Spinner> : undefined}
                                Login
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
        </UserContext.Consumer>
    )
}

export default Login
