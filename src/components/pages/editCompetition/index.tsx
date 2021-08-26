/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import * as yup from "yup"
import {BottomFields, TopFields} from "./components"
import {Button, FormGroup} from "react-bootstrap"
import {Competition, competitionSchema} from "~/schemas/competition"
import {Form, Formik, FormikHelpers} from "formik"
import {NotificationContext, UserContext} from "~/contexts"
import {highlight, languages} from "prismjs"
import {readCache, validate} from "~/utils"
import Editor from "@luke-zhang-04/react-simple-markdown-editor"
import Markdown from "~/components/markdown"
import {MarkdownButtons} from "~/components/markdown/editor"
import React from "react"
import {Spinner} from "~/components/bootstrap"
import {competitionAdapter} from "~/adapters/competition"
import editCompetitionAdapter from "~/adapters/editCompetition"
import {hash} from "@luke-zhang-04/utils/browser"
import styles from "~/components/markdown/styles.module.scss"

const formValidationSchema = yup.object({
    name: yup.string().max(64),
    shortDesc: yup.string().required("Short description is required").max(128),
    videoURL: yup
        .string()
        .url()
        .matches(/youtu\.be|youtube/u, "Video must be a YouTube Link")
        .max(256),
    website: yup.string().url().max(256),
    coverImageURL: yup.string().url().max(256),
    deadline: yup.date().required().min(new Date(), "Deadline must be in the future"),
})

interface FormValues {
    name?: string
    shortDesc: string
    videoURL?: string
    website?: string
    coverImageURL?: string
    deadline: string
}

export const EditCompetition: React.FC<{id?: number}> = ({id}) => {
    const [competition, setCompetition] = React.useState<Competition | undefined>()
    const [desc, setDesc] = React.useState(
        "# New Competition\n\nThis is Markdown. You can find out how to use markdown [here](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)",
    )
    const [mode, setMode] = React.useState<"edit" | "preview">("edit")
    const {currentUser: user} = React.useContext(UserContext)
    const {addNotification: notify} = React.useContext(NotificationContext)
    const initialDataHash = React.useRef<string | undefined>()

    const getInitialValues = React.useCallback(
        (_competition?: Competition | FormValues): FormValues => ({
            name: _competition?.name ?? undefined,
            shortDesc: _competition?.shortDesc ?? "",
            videoURL: _competition?.videoURL ?? "",
            website: _competition?.website ?? "",
            coverImageURL: _competition?.coverImageURL ?? "",
            deadline: (typeof _competition?.deadline === "string"
                ? new Date(_competition?.deadline)
                : _competition?.deadline ?? new Date()
            )
                .toISOString()
                .slice(0, 10),
        }),
        [],
    )

    const shouldSubmitCompetition = React.useCallback(
        async (values?: FormValues) => {
            const newDataHash = await hash(
                JSON.stringify({
                    ...getInitialValues(values),
                    desc,
                }),
                "SHA-256",
                "base64",
            )

            return newDataHash !== initialDataHash.current // If data has been changed
        },
        [desc, initialDataHash.current],
    )

    const submit = React.useCallback(
        async (values: FormValues, {setSubmitting}: FormikHelpers<FormValues>) => {
            setSubmitting(true)

            if (!(await shouldSubmitCompetition(values))) {
                notify({
                    title: "Success!",
                    content: "Successfully edited your project!",
                    icon: "done_all",
                    iconClassName: "text-success",
                })
            } else if (user) {
                const result = await editCompetitionAdapter(user, {
                    id: id?.toString() ?? "new",
                    title: values.name ?? "",
                    desc,
                    shortDesc: values.shortDesc,
                    videoURL: values.videoURL,
                    deadline: values.deadline,
                    website: values.website,
                    coverImageURL: values.coverImageURL,
                })

                if (!(result instanceof Error)) {
                    notify({
                        title: "Success!",
                        content: `Successfully ${
                            id === undefined ? "created" : "edited"
                        } your competition!`,
                        icon: "done_all",
                        iconClassName: "text-success",
                    })
                }
            }

            setSubmitting(false)
        },
        [id, desc, user, notify],
    )

    React.useEffect(() => {
        ;(async () => {
            const data = await validate(
                competitionSchema,
                await readCache(`talentmakerCache_competition-${id}`),
                false,
            )

            if (data && !competition) {
                setCompetition(data)

                if (data.desc) {
                    setDesc(data.desc)
                }
            }
        })()
        ;(async () => {
            if (id && user) {
                const data = await competitionAdapter(user.uid, id.toString())

                if (data instanceof Error) {
                    return
                }

                setCompetition(data)

                if (data.desc) {
                    setDesc(data.desc)
                }

                initialDataHash.current = await hash(
                    JSON.stringify({
                        ...getInitialValues(data),
                        desc,
                    }),
                    "SHA-256",
                    "base64",
                )
            }
        })()
    }, [id, user, user?.uid])

    if (!user) {
        return (
            <>
                <h1>Unauthenticated</h1>
                <p>You are not logged in</p>
            </>
        )
    } else if (competition && competition.organizationId !== user.uid) {
        return (
            <>
                <h1>Unauthorized</h1>
                <p>This isn&apos;t your competition</p>
            </>
        )
    }

    return competition || id === undefined ? (
        <Formik
            enableReinitialize
            initialValues={getInitialValues(competition)}
            onSubmit={submit}
            validationSchema={formValidationSchema}
        >
            {({isSubmitting}): JSX.Element => (
                <Form className="px-4 py-3">
                    <TopFields />
                    <MarkdownButtons {...{mode, setMode}} />
                    <FormGroup
                        className={`form-group ${styles.markdownEditorContainer} bg-lighter px-3`}
                    >
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
                                    preClassName={styles.editorPre}
                                    padding={3}
                                />
                            ) : (
                                <div className={`${styles.markdownContainer} p-0`}>
                                    <div className="bg-lighter p-1">
                                        <Markdown plainHeadings>{desc}</Markdown>
                                    </div>
                                </div>
                            )
                        }
                    </FormGroup>
                    <BottomFields />
                    <Button variant="success" type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Spinner inline> </Spinner>}
                        Submit
                    </Button>
                </Form>
            )}
        </Formik>
    ) : (
        <Spinner color="primary" size="25vw" className="my-5" centered />
    )
}

export default EditCompetition
