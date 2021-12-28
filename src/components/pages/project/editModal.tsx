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
import {Button, Modal} from "react-bootstrap"
import {Form, Formik, FormikHelpers} from "formik"
import {NotificationContext, UserContext} from "~/contexts"
import {Input} from "~/components/formik"
import MaterialIcons from "~/components/materialIcons"
import {Project} from "~/schemas/project"
import React from "react"
import {Spinner} from "~/components/bootstrap"
import {hash} from "@luke-zhang-04/utils/browser"
import {pick} from "@luke-zhang-04/utils"

const formValidationSchema = yup.object({
    name: yup
        .string()
        .required("Title is required") // eslint-disable-next-line
        .max(64),
    srcURL: yup.string().url().nullable().max(256),
    demoURL: yup.string().url().nullable().max(256),
    license: yup.string().nullable().max(256),
    videoURL: yup
        .string()
        .url()
        .matches(/youtu\.be|youtube/u, "Video must be a YouTube Link")
        .nullable()
        .max(256),
})

type FormValues = typeof formValidationSchema["__outputType"]

const sharedInputProps = {
    shouldShowValidFeedback: false,
    className: "bg-lighter",
    shouldShowLabel: true,
}

interface Props {
    project: Project
    shouldShow: boolean
    onClose?: () => void
    onSave?: (project: Project) => void
}

export const EditModal: React.FC<Props> = ({shouldShow, onClose, onSave, project}) => {
    const initialDataHash = React.useRef<string | undefined>()
    const {addNotification: notify} = React.useContext(NotificationContext)
    const {currentUser: user} = React.useContext(UserContext)

    React.useEffect(() => {
        ;(async () => {
            initialDataHash.current = await hash(
                JSON.stringify(pick(project, "name", "srcURL", "demoURL", "license", "videoURL")),
                "SHA-256",
                "base64",
            )
        })()
    }, [])

    const shouldSubmitProject = async (values: FormValues) => {
        const newDataHash = await hash(
            JSON.stringify(pick(values, "name", "srcURL", "demoURL", "license", "videoURL")),
            "SHA-256",
            "base64",
        )

        return newDataHash !== initialDataHash.current // If data has been changed
    }

    const submit = async (
        values: FormValues,
        {setSubmitting}: Pick<FormikHelpers<FormValues>, "setSubmitting">,
    ) => {
        setSubmitting(true)

        if (user) {
            if (await shouldSubmitProject(values)) {
                const result = await adapters.project.update(user, {
                    ...values,
                    title: values.name,
                    projectId: project.id,
                })

                if (!(result instanceof Error)) {
                    onSave?.({...project, ...values})

                    notify({
                        title: "Success!",
                        content: "Successfully edited your project!",
                        icon: "done_all",
                        iconClassName: "text-success",
                    })

                    initialDataHash.current = await hash(
                        JSON.stringify(
                            pick(values, "name", "srcURL", "demoURL", "license", "videoURL"),
                        ),
                        "SHA-256",
                        "base64",
                    )
                }
            } else {
                notify({
                    title: "Success!",
                    content: "Successfully edited your project!",
                    icon: "done_all",
                    iconClassName: "text-success",
                })
            }
        }

        setSubmitting(false)
        onClose?.()
    }

    const syncWithGithub = async (
        repoName: string,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        setSubmitting(true)

        const values = await adapters.github.getRepo(repoName)

        if (values instanceof Error) {
            return
        }

        await submit({...values, videoURL: project.videoURL}, {setSubmitting})

        setSubmitting(false)
    }

    return (
        <Modal show={shouldShow} onHide={onClose}>
            <Formik
                enableReinitialize
                initialValues={pick(project, "name", "srcURL", "demoURL", "license", "videoURL")}
                validationSchema={formValidationSchema}
                onSubmit={submit}
            >
                {({isSubmitting, setSubmitting, values}): JSX.Element => (
                    <Form>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit project settings</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="bg-light px-4 py-3">
                            <Input
                                {...sharedInputProps}
                                name="name"
                                type="text"
                                label="Submission Title"
                                placeholder="Submission Title"
                            >
                                <MaterialIcons icon="sort" />
                            </Input>
                            <Input
                                {...sharedInputProps}
                                name="srcURL"
                                type="url"
                                label="Source Code URL"
                                placeholder="Source Code URL"
                            >
                                <MaterialIcons icon="code" />
                            </Input>
                            <Input
                                {...sharedInputProps}
                                name="demoURL"
                                type="url"
                                label="Demo URL"
                                placeholder="Demo URL"
                            >
                                <MaterialIcons icon="preview" />
                            </Input>
                            <Input
                                {...sharedInputProps}
                                name="license"
                                type="text"
                                label="License"
                                placeholder="SPDX License ID or URL to a custom license"
                            >
                                <MaterialIcons icon="gavel" />
                            </Input>
                            <Input
                                {...sharedInputProps}
                                name="videoURL"
                                type="url"
                                label="Video URL"
                                placeholder="Video URL"
                            >
                                <MaterialIcons icon="video_library" />
                            </Input>
                            {values.srcURL?.includes("github") && (
                                <Button
                                    variant="outline-dark"
                                    onClick={() =>
                                        syncWithGithub(
                                            values.srcURL!.split("/").slice(-2).join("/"),
                                            setSubmitting,
                                        )
                                    }
                                >
                                    <span className="bi-github" /> Sync with Github
                                </Button>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-danger" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" disabled={isSubmitting} type="submit">
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
