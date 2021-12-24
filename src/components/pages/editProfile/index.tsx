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
import {NotificationContext, UserContext} from "~/contexts"
import {Input} from "~/components/formik"
import MetaTags from "~/components/metaTags"
import React from "react"
import {Spinner} from "~/components/bootstrap"

const validationSchema = yup.object({
    oldPassword: yup.string().required(),
    newPassword: yup
        .string()
        .required()
        .min(8)
        .matches(/[0-9]/gu, "Password must include at least 1 number")
        .matches(/[a-z]/gu, "Password must include at least 1 lowercase letter")
        .matches(/[A-Z]/gu, "Password must include at least 1 uppercase letter"),
    newPassword2: yup
        .string()
        .oneOf([yup.ref("newPassword"), undefined], "Passwords must match")
        .required(),
})

type FormValues = typeof validationSchema["__outputType"]

const initialValues: FormValues = {
    oldPassword: "",
    newPassword: "",
    newPassword2: "",
}

export const EditProfile: React.FC = () => {
    const {currentUser: user} = React.useContext(UserContext)
    const {addNotification: notify} = React.useContext(NotificationContext)

    if (user) {
        const onSubmit = async (
            values: FormValues,
            {setSubmitting}: FormikHelpers<FormValues>,
        ): Promise<void> => {
            setSubmitting(true)
            const changePassword = await adapters.auth.changePassword(
                user,
                values.oldPassword,
                values.newPassword,
            )

            if (!(changePassword instanceof Error)) {
                notify({
                    title: "Changed Password.",
                    content:
                        "Success! Your password has been changed. You may have to sign in again later.",
                    icon: "account_box",
                    iconClassName: "text-success",
                })
            }

            setSubmitting(false)
        }

        return (
            <Container fluid className="my-3">
                <h1>Edit Profile</h1>
                <h2>Change Password</h2>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <Input
                                name="oldPassword"
                                type="password"
                                label="Old Password"
                                className="bg-lighter"
                                noFeedback
                            >
                                <span className="material-icons">password</span>
                            </Input>
                            <Input
                                name="newPassword"
                                type="password"
                                label="New Password"
                                className="bg-lighter"
                                noFeedback
                            >
                                <span className="material-icons">vpn_key</span>
                            </Input>
                            <Input
                                name="newPassword2"
                                type="password"
                                label="Confirm New Password"
                                className="bg-lighter"
                            >
                                <span className="material-icons">vpn_key</span>
                            </Input>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-3 float-end"
                            >
                                {isSubmitting ? <Spinner inline> </Spinner> : undefined}
                                Change Pasword
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Container>
        )
    }

    return (
        <>
            <MetaTags statusCode={401} />
            <Container fluid className="my-3">
                <p>You are not logged in</p>
            </Container>
        </>
    )
}
