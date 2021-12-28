/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

/* eslint-disable prefer-named-capture-group */
import * as adapters from "~/adapters"
import * as yup from "yup"
import {Button, Container} from "react-bootstrap"
import {Checkbox, Input} from "~/components/formik"
import {Form, Formik, FormikHelpers} from "formik"
import LoadingDots from "~/components/loadingDots"
import MaterialIcons from "~/components/materialIcons"
import {NotificationContext} from "~/contexts"
import React from "react"
import {Spinner} from "~/components/bootstrap"

const Zxcvbn = React.lazy(() => import("~/components/zxcvbn"))

interface FormValues {
    username: string
    email: string
    password: string
    password2: string
    didagree: boolean
}

const isRequired = "is a required field."

const initialValues = {
    username: "",
    email: "",
    password: "",
    password2: "",
    didagree: false,
}

const validationSchema = yup.object({
    username: yup.string().required(`Username ${isRequired}`).max(32),
    email: yup.string().required(`Email ${isRequired}`).email(),
    password: yup
        .string()
        .required()
        .min(8)
        .matches(/[0-9]/gu, "Password must include at least 1 number")
        .matches(/[a-z]/gu, "Password must include at least 1 lowercase letter")
        .matches(/[A-Z]/gu, "Password must include at least 1 uppercase letter"),
    password2: yup
        .string()
        .oneOf([yup.ref("password"), undefined], "Passwords must match")
        .required(),
})

export const Reg: React.FC = () => {
    const {addNotification: notify} = React.useContext(NotificationContext)

    const submit = async (
        values: FormValues,
        {setSubmitting}: FormikHelpers<FormValues>,
    ): Promise<void> => {
        setSubmitting(true)
        const register = await adapters.auth.register(
            values.username,
            values.email,
            values.password,
        )

        if (!(register instanceof Error)) {
            notify({
                title: "Successfully Registered!",
                content: "Success! You have been registered! Please confirm your email.",
                icon: "account_box",
                iconClassName: "text-success",
            })
        }

        setSubmitting(false)
    }

    const validate = (values: FormValues): {} => {
        const errors: {[key: string]: string} = {}

        if (!values.didagree) {
            errors.didagree =
                "Make sure you have read and agree to the terms and conditions, and privacy policy."
        }

        return errors
    }

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={submit}
            validate={validate}
            validationSchema={validationSchema}
        >
            {({isSubmitting, values}): JSX.Element => (
                <Container fluid as={Form}>
                    <Input name="username" type="username" label="Username">
                        <MaterialIcons icon="person" />
                    </Input>
                    <Input name="email" type="email" label="Email">
                        <MaterialIcons icon="alternate_email" />
                    </Input>
                    <Input name="password" type="password" label="Password">
                        <MaterialIcons icon="vpn_key" />
                    </Input>
                    <Input name="password2" type="password" label="Confirm password">
                        <MaterialIcons icon="vpn_key" />
                    </Input>
                    <Checkbox name="didagree" type="checkbox" />

                    <React.Suspense fallback={values.password && <LoadingDots small />}>
                        <Zxcvbn password={values.password} className="mt-3" />
                    </React.Suspense>

                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner inline> </Spinner> : undefined}
                        Register
                    </Button>
                </Container>
            )}
        </Formik>
    )
}

export default Reg
