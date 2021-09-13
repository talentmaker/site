/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as adapters from "~/adapters"
import * as yup from "yup"
import {Button, Container} from "react-bootstrap"
import {Form, Formik, FormikHelpers} from "formik"
import {Input} from "~/components/formik"
import React from "react"
import {Spinner} from "~/components/bootstrap"
import UserContext from "~/contexts/userContext"
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
    const {setUserFromUnknown: setUser} = React.useContext(UserContext)
    const submit = React.useCallback(
        async (values: FormValues, {setSubmitting}: FormikHelpers<FormValues>): Promise<void> => {
            setSubmitting(true)

            const data = await adapters.auth.login(values.email, values.password)

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
        <Formik
            initialValues={initialValues}
            onSubmit={submit}
            validationSchema={validationSchema}
            validateOnMount
        >
            {({isSubmitting}): JSX.Element => (
                <Container fluid as={Form}>
                    <Input name="email" type="Email" label="Email">
                        <span className="material-icons">person</span>
                    </Input>
                    <Input name="password" type="password" label="Password">
                        <span className="material-icons">vpn_key</span>
                    </Input>

                    <Button
                        className="mt-3"
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Spinner inline> </Spinner> : undefined}
                        Login
                    </Button>
                </Container>
            )}
        </Formik>
    )
}

export default Login
