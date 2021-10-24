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
import {Button, Form, Modal} from "react-bootstrap"
import {Formik, FormikHelpers} from "formik"
import {NotificationContext, UserContext} from "~/contexts"
import {Competition} from "~/schemas/competition"
import {Input} from "~/components/formik"
import React from "react"
import {Spinner} from "~/components/bootstrap"
import {hash} from "@luke-zhang-04/utils/browser"
import {pick} from "@luke-zhang-04/utils"

const formValidationSchema = yup.object({
    name: yup.string().nullable().max(64),
    shortDesc: yup.string().required("Short description is required").max(128),
    videoURL: yup
        .string()
        .url()
        .matches(/youtu\.be|youtube/u, "Video must be a YouTube Link")
        .nullable()
        .max(256),
    website: yup.string().url().nullable().max(256),
    coverImageURL: yup.string().url().nullable().max(256),
    deadline: yup
        .string()
        .test(
            "is-date",
            "${path} is an invalid date",
            (value) => value !== undefined && !isNaN(new Date(value).getTime()),
        )
        .test(
            "is-in-future",
            "${path} must be in the future",
            (value) => value !== undefined && new Date(value).getTime() > Date.now(),
        ),
})

type FormValues = typeof formValidationSchema["__outputType"]

const sharedInputProps = {
    shouldShowValidFeedback: false,
    className: "bg-lighter",
    shouldShowLabel: true,
}

interface Props {
    competition: Competition
    shouldShow: boolean
    onClose?: () => void
    onSave?: (competition: Competition) => void
}

export const EditModal: React.FC<Props> = ({shouldShow, onClose, onSave, competition}) => {
    const initialDataHash = React.useRef<string | undefined>()
    const {addNotification: notify} = React.useContext(NotificationContext)
    const {currentUser: user} = React.useContext(UserContext)

    React.useEffect(() => {
        ;(async () => {
            initialDataHash.current = await hash(
                JSON.stringify(
                    pick(
                        competition,
                        "name",
                        "shortDesc",
                        "videoURL",
                        "website",
                        "coverImageURL",
                        "deadline",
                    ),
                ),
                "SHA-256",
                "base64",
            )
        })()
    }, [])

    const shouldSubmitCompetition = React.useCallback(
        async (values: FormValues) => {
            const newDataHash = await hash(
                JSON.stringify(
                    pick(
                        values,
                        "name",
                        "shortDesc",
                        "videoURL",
                        "website",
                        "coverImageURL",
                        "deadline",
                    ),
                ),
                "SHA-256",
                "base64",
            )

            return newDataHash !== initialDataHash.current // If data has been changed
        },
        [initialDataHash.current],
    )

    const submit = React.useCallback(
        async (values: FormValues, {setSubmitting}: FormikHelpers<FormValues>) => {
            setSubmitting(true)

            if (user) {
                if (await shouldSubmitCompetition(values)) {
                    const result = await adapters.competition.update(user, {
                        ...values,
                        title: values.name,
                        id: competition.id,
                    })

                    if (!(result instanceof Error)) {
                        onSave?.({
                            ...competition,
                            ...values,
                            deadline: values.deadline ? new Date(values.deadline) : undefined,
                        })

                        notify({
                            title: "Success!",
                            content: "Successfully edited your competition!",
                            icon: "done_all",
                            iconClassName: "text-success",
                        })

                        initialDataHash.current = await hash(
                            JSON.stringify(
                                pick(
                                    values,
                                    "name",
                                    "shortDesc",
                                    "videoURL",
                                    "website",
                                    "coverImageURL",
                                    "deadline",
                                ),
                            ),
                            "SHA-256",
                            "base64",
                        )
                    }
                } else {
                    notify({
                        title: "Success!",
                        content: "Successfully edited your competition!",
                        icon: "done_all",
                        iconClassName: "text-success",
                    })
                }
            }

            setSubmitting(false)
            onClose?.()
        },
        [typeof onClose, user?.uid, competition.id],
    )

    return (
        <Modal show={shouldShow} onHide={onClose}>
            <Formik
                enableReinitialize
                initialValues={{
                    ...pick(
                        competition,
                        "name",
                        "shortDesc",
                        "videoURL",
                        "website",
                        "coverImageURL",
                    ),
                    deadline: competition.deadline?.toISOString().slice(0, 10),
                }}
                validationSchema={formValidationSchema}
                onSubmit={submit}
            >
                {({isSubmitting, submitForm}): JSX.Element => (
                    <Form>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit competition settings</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="bg-light px-4 py-3">
                            <Input
                                {...sharedInputProps}
                                name="name"
                                type="text"
                                label="Competition Title"
                                placeholder="Competition Title"
                            >
                                <span className="material-icons">sort</span>
                            </Input>
                            <Input
                                {...sharedInputProps}
                                name="shortDesc"
                                type="text"
                                label="Short Description"
                                placeholder="Short Description"
                            >
                                <span className="material-icons">description</span>
                            </Input>
                            <Input
                                {...sharedInputProps}
                                name="deadline"
                                type="date"
                                label="Deadline"
                            >
                                <span className="material-icons">event</span>
                            </Input>
                            <Input
                                {...sharedInputProps}
                                name="videoURL"
                                type="url"
                                label="Video URL"
                                placeholder="Video URL"
                            >
                                <span className="material-icons">video_library</span>
                            </Input>
                            <Input
                                {...sharedInputProps}
                                name="website"
                                type="url"
                                label="Website URL"
                                placeholder="Website URL"
                            >
                                <span className="material-icons">language</span>
                            </Input>
                            <Input
                                {...sharedInputProps}
                                name="coverImageURL"
                                type="url"
                                label="Cover Image URL"
                                placeholder="Cover Image URL"
                            >
                                <span className="material-icons">insert_photo</span>
                            </Input>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-secondary" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" disabled={isSubmitting} onClick={submitForm}>
                                {isSubmitting && <Spinner inline> </Spinner>}
                                Edit
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default EditModal
