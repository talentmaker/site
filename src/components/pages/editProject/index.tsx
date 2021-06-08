/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import * as yup from "yup"
import {BottomFields, TopFields} from "./components"
import {Form, Formik, FormikHelpers} from "formik"
import {hash, notify} from "../../../utils"
import {highlight, languages} from "prismjs"
import Editor from "@luke-zhang-04/react-simple-markdown-editor"
import Markdown from "../../markdown"
import {MarkdownButtons} from "../../markdown/editor"
import {Project} from "../../../schemas/project"
import React from "react"
import {Spinner} from "../../bootstrap"
import UserContext from "../../../contexts/userContext"
import editProjectAdapter from "../../../adapters/editProject"
import {projectAdapter} from "../../../adapters/project"

const formValidationSchema = yup.object({
    name: yup
        .string()
        .required("Title is required") // eslint-disable-next-line
        .max(64),
    srcURL: yup.string().url().max(256),
    demoURL: yup.string().url().max(256),
    license: yup.string().max(256),
    videoURL: yup
        .string()
        .url()
        .matches(/youtu\.be|youtube/u, "Video must be a YouTube Link")
        .max(256),
})

interface FormValues {
    name: string
    srcURL?: string
    demoURL?: string
    license?: string
    videoURL?: string
}

export const EditProject: React.FC<
    {id: string; compId?: undefined} | {compId: string; id?: undefined}
> = ({id, compId}) => {
    const [project, setProject] = React.useState<Project | undefined>()
    const [desc, setDesc] = React.useState(
        "# My Submission\n\nThis is Markdown. You can find out how to use markdown [here](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)",
    )
    const [mode, setMode] = React.useState<"edit" | "preview">("edit")
    const {currentUser: user} = React.useContext(UserContext)
    const initialDataHash = React.useRef<string | undefined>()

    const getInitialValues = React.useCallback(
        (_project?: Project | FormValues): FormValues => ({
            name: _project?.name ?? `${user?.username ?? ""}'s Submission`,
            srcURL: _project?.srcURL ?? "",
            demoURL: _project?.demoURL ?? "",
            license: _project?.license ?? "",
            videoURL: _project?.videoURL ?? "",
        }),
        [],
    )

    const shouldSubmitProject = React.useCallback(
        async (values?: FormValues) => {
            const newDataHash = await hash("SHA-256", {
                ...getInitialValues(values),
                desc,
            })

            return newDataHash !== initialDataHash.current // If data has been changed
        },
        [desc, initialDataHash.current],
    )

    const submit = React.useCallback(
        async (values: FormValues, {setSubmitting}: FormikHelpers<FormValues>) => {
            setSubmitting(true)

            if (!(await shouldSubmitProject(values))) {
                notify({
                    title: "Success!",
                    content: "Successfully edited your project!",
                    icon: "done_all",
                    iconClassName: "text-success",
                })
            } else if (user) {
                const result = await editProjectAdapter(user, {
                    projectId: id,
                    compId,
                    title: values.name,
                    desc,
                    srcURL: values.srcURL,
                    demoURL: values.demoURL,
                    license: values.license,
                    videoURL: values.videoURL,
                })

                if (!(result instanceof Error)) {
                    notify({
                        title: "Success!",
                        content: `Successfully ${
                            id === undefined ? "created" : "edited"
                        } your project!`,
                        icon: "done_all",
                        iconClassName: "text-success",
                    })
                }
            }

            setSubmitting(false)
        },
        [id, compId, desc, user],
    )

    React.useEffect(() => {
        ;(async () => {
            if (user) {
                const data = await projectAdapter(user, id, compId)

                if (data instanceof Error) {
                    return
                }

                setProject(data)

                if (data.desc) {
                    setDesc(data.desc)
                }

                initialDataHash.current = await hash("SHA-256", {
                    ...getInitialValues(data),
                    desc,
                })
            }
        })()
    }, [id, compId, user])

    if (!user) {
        return (
            <>
                <h1>Unauthenticated</h1>
                <p>You are not logged in</p>
            </>
        )
    } else if (project && project.creator !== user.sub) {
        return (
            <>
                <h1>Unauthorized</h1>
                <p>This isn&apos;t your project</p>
            </>
        )
    }

    return project ? (
        <Formik
            enableReinitialize
            initialValues={getInitialValues(project)}
            onSubmit={submit}
            validationSchema={formValidationSchema}
        >
            {({isSubmitting}): JSX.Element => (
                <Form className="px-4 py-3">
                    <TopFields />
                    <MarkdownButtons {...{mode, setMode}} />
                    <div className="form-group markdown-editor-container bg-lighter px-3">
                        {
                            /**
                             * If edit mode, show markdown editor Otherwise, show the preview
                             */
                            mode === "edit" ? (
                                <Editor
                                    value={desc}
                                    onValueChange={(code) => setDesc(code)}
                                    highlight={(code) =>
                                        highlight(code, languages.markdown, "markdown")
                                    }
                                    className="form-control bg-none"
                                    padding={3}
                                />
                            ) : (
                                <div className="markdown-container p-0">
                                    <div className="bg-lighter p-1">
                                        <Markdown plainHeadings>{desc}</Markdown>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <BottomFields />
                    <button className="btn btn-success" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner inline> </Spinner> : undefined}
                        Submit
                    </button>
                </Form>
            )}
        </Formik>
    ) : (
        <Spinner color="primary" size="25vw" className="my-5" centered />
    )
}

export default EditProject
