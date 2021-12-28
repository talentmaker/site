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
import {Form, Formik, FormikHelpers} from "formik"
import {Button} from "react-bootstrap"
import {Input} from "~/components/formik"
import MaterialIcons from "~/components/materialIcons"
import {NotificationContext} from "~/contexts"
import React from "react"
import {Spinner} from "~/components/bootstrap"

const validationSchema = yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    subject: yup.string(),
    message: yup.string().required(),
})

type FormValues = typeof validationSchema["__outputType"]

const initialValues: FormValues = {
    name: "",
    email: "",
    subject: "",
    message: "",
}

export const ContactForm: React.FC = () => {
    const {addNotification: notify} = React.useContext(NotificationContext)

    const onSubmit = async (
        {name, email, subject, message}: FormValues,
        {setSubmitting}: FormikHelpers<FormValues>,
    ): Promise<void> => {
        setSubmitting(true)
        const contact = await adapters.misc.contact(name, email, subject, message)

        if (!(contact instanceof Error)) {
            notify({
                title: "Message sent successully",
                content: "Successfully sent your message!",
                icon: "email",
                iconClassName: "text-success",
            })
        }

        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            {({isSubmitting}) => (
                <Form className="d-flex flex-column align-items-end">
                    <Input name="name" label="Name" type="text">
                        <MaterialIcons icon="person" />
                    </Input>
                    <Input name="email" label="Email" type="email">
                        <MaterialIcons icon="email" />
                    </Input>
                    <Input name="subject" label="Subject" type="text">
                        <MaterialIcons icon="subject" />
                    </Input>
                    <Input name="message" label="Message" type="text" textArea>
                        <MaterialIcons icon="chat_bubble" />
                    </Input>
                    <div>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-3 d-block"
                        >
                            Send email{" "}
                            {isSubmitting ? (
                                <Spinner inline> </Spinner>
                            ) : (
                                <MaterialIcons icon="send" />
                            )}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}
