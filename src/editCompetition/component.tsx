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

import "react-datepicker/dist/react-datepicker.css"
import BaseComponent, {FormValues} from "./baseComponent"
import {Form, Formik, FormikHelpers} from "formik"
import {highlight, languages} from "prismjs"
import DatePicker from "react-datepicker"
import Editor from "@luke-zhang-04/react-simple-markdown-editor"
import Markdown from "../markdown"
import React from "react"
import {Spinner} from "../bootstrap"
import handleError from "../errorHandler"
import {hash} from "../utils/crypto"
import notify from "../notify"
import {url} from "../globals"

export default class EditCompetitionComponent extends BaseComponent {

    /**
     * Checks if data has been changed
     */
    private _shouldSubmit = async (): Promise<boolean> => {
        const newDataHash = await hash("SHA-256", {
            ...this.initialValues(),
            desc: this.state.desc,
        })

        return newDataHash !== this.initialDataHash // If data has been changed
    }

    /* eslint-disable max-lines-per-function, max-statements */ // Unavoidable
    private _submit = async (
        values: FormValues,
        {setSubmitting}: FormikHelpers<FormValues>,
    ): Promise<void> => {
        setSubmitting(true)

        if (this.state.deadline === null || this.state.deadline === undefined) {
            setSubmitting(false)

            return notify({
                title: "Unauthorized",
                icon: "report_problem",
                iconClassName: "text-danger",
                content: "Deadline is required",
            })
        }

        const shouldSubmit = await this._shouldSubmit()

        if (!shouldSubmit) {
            notify({
                title: "Success!",
                content: "Successfully edited your project!",
                icon: "done_all",
                iconClassName: "text-success",
            })
        } else if (this.props.user) {
            try {
                const response = await fetch(
                    `${url}/competitions/write`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            idToken: this.props.user.idToken,
                            idTokenChecksum: this.props.user.idTokenChecksum,
                            id: this.props.id?.toString(),
                            title: values.name,
                            desc: this.state.desc,
                            shortDesc: values.shortDesc,
                            videoURL: values.videoURL,
                            deadline: this.state.deadline,
                            website: values.website,
                            coverImageURL: values.coverImageURL,
                        }),
                    },
                )
                const data = await response.json() as {[key: string]: unknown}

                if (response.status === 200) {
                    notify({
                        title: "Success!",
                        content: `Successfully ${this.props.id === undefined ? "created" : "edited"} your competition!`,
                        icon: "done_all",
                        iconClassName: "text-success",
                    })
                } else {
                    throw data
                }
            } catch (err: unknown) {
                handleError(err)
            }
        } else {
            notify({
                title: "Error",
                icon: "report_problem",
                iconClassName: "text-danger",
                content: "Not authenticated.",
            })
        }

        setSubmitting(false)
    }
    /* eslint-enable max-lines-per-function, max-statements */ // Unavoidable

    /**
     * Buttons for the markdown editor
     */
    private _markdownButtons = (): JSX.Element => (
        <div className="row bg-lighter mx-0">
            <div className="col-12 d-flex m-0 p-0">
                {
                    this.state.mode === "edit"
                        ? <>
                            <button
                                type="button"
                                className="btn py-1 disabled btn-lighter"
                            >Edit</button>
                            <button
                                type="button"
                                className="btn py-1 btn-light-grey"
                                onClick={(): void => this.setState({mode: "preview"})}
                            >Preview</button>
                        </>
                        : <>
                            <button
                                type="button"
                                className="btn py-1 btn-light-grey"
                                onClick={(): void => this.setState({mode: "edit"})}
                            >Edit</button>
                            <button
                                type="button"
                                className="btn py-1 disabled btn-lighter border-right-1"
                            >Preview</button>
                        </>
                }
            </div>
        </div>
    )

    /**
     * Renders the date picker
     */
    private _datePicker = (): JSX.Element => <div className="input-group">
        <div className="input-group-prepend">
            <span className="input-group-text">
                <span className="material-icons">event</span>
            </span>
        </div>
        <DatePicker
            className="form-control bg-lighter text-dark"
            selected={this.state.deadline}
            onChange={(date): void => {
                if (date instanceof Date && date.getTime() > Date.now()) {
                    this.setState({deadline: date})
                } else if (
                    date instanceof Array &&
                    date[1] instanceof Date &&
                    date[1].getTime() > Date.now()
                ) {
                    this.setState({deadline: date[1]})
                }
            }}
        />
    </div>

    /**
     * Render the markdown preview
     */
    private _markdownPreview = (): JSX.Element => <div className="markdown-container p-0">
        <div className="bg-lighter p-1">
            <Markdown plainHeadings>{this.state.desc}</Markdown>
        </div>
    </div>

    private _markdownEditor = (): JSX.Element => <Editor
        value={this.state.desc}
        onValueChange={(code: string): void => this.setState({desc: code})}
        highlight={(code): string => highlight(code, languages.markdown, "markdown")}
        className="form-control bg-none"
        padding={3}
    />

    protected content = (): JSX.Element => <Formik
        enableReinitialize
        initialValues={this.initialValues()}
        onSubmit={this._submit}
        validationSchema={EditCompetitionComponent.validationSchema}
    >
        {({isSubmitting}): JSX.Element => <Form className="px-4 py-3">
            <EditCompetitionComponent.topFields/>
            {this._datePicker()}
            {this._markdownButtons()}
            <div className="form-group markdown-editor-container bg-lighter px-3">{

                /**
                 * If edit mode, show markdown editor
                 * Otherwise, show the preview
                 */
                this.state.mode === "edit"
                    ? this._markdownEditor()
                    : this._markdownPreview()

            }</div>
            <EditCompetitionComponent.otherFields/>
            <button
                className="btn btn-success"
                type="submit"
                disabled={isSubmitting}
            >
                {
                    isSubmitting
                        ? <Spinner inline> </Spinner>
                        : undefined
                }
                Submit
            </button>
        </Form>}
    </Formik>

    public render = (): JSX.Element => (
        this.didSetData
            ? this.content()
            : <Spinner color="primary" size="25vw" className="my-5" centered/>
    )

}
