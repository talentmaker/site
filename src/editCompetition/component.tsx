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
import {isCompetition} from "../competition/baseComponent"
import notify from "../notify"
import {url} from "../globals"

export default class EditCompetitionComponent extends BaseComponent {

    public componentDidMount = async (): Promise<void> => {
        const {user, id: compId} = this.props

        if (user && compId) {
            try {
                const data = await (await fetch(
                    `${url}/competitions/getOne?id=${compId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                )).json() as {[key: string]: unknown}

                if (!isCompetition(data)) {
                    return
                }

                if (this.props.user?.sub === data.orgId) {
                    this._didSetData = true

                    this.setState({
                        competition: data,
                        deadline: new Date(data.deadline),
                    })

                    if (data.desc) { // Update description
                        this.setState({desc: data.desc})
                    }
                } else {
                    notify({
                        title: "Unauthorized",
                        icon: "report_problem",
                        iconClassName: "text-danger",
                        content: `You can't modify this competition.`,
                    })
                }
            } catch (err: unknown) {
                handleError(err)
            }
        } else {
            handleError({
                name: "Not authorized",
                message: "User is not authorized to modify this. You may be logged out.",
            })
        }
    }

    public componentDidUpdate = (): void => {
        if (!this._hasUser && this.props.user) {
            this.componentDidMount()

            this._hasUser = true
        }
    }

    private _hasUser = this.props.user !== undefined

    private _didSetData = this.props.id === undefined || false

    /* eslint-disable max-lines-per-function, max-statements */ // Unavoidable
    private _submit = async (
        values: FormValues,
        {setSubmitting}: FormikHelpers<FormValues>,
    ): Promise<void> => {
        setSubmitting(true)

        if (this.state.deadline === null || this.state.deadline === undefined) {
            return notify({
                title: "Unauthorized",
                icon: "report_problem",
                iconClassName: "text-danger",
                content: "Deadline is required",
            })
        }

        if (this.props.user) {
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
                    ),
                    data = await response.json() as {[key: string]: unknown}

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

    private _initialValues = (): FormValues => {
        const {competition} = this.state

        return {
            name: competition?.name ?? "",
            shortDesc: competition?.shortDesc ?? "",
            videoURL: competition?.videoURL ?? "",
            website: competition?.website ?? "",
            coverImageURL: competition?.coverImageURL ?? "",
        }
    }

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
            <Markdown>{this.state.desc}</Markdown>
        </div>
    </div>

    protected content = (): JSX.Element => <Formik
        enableReinitialize
        initialValues={this._initialValues()}
        onSubmit={this._submit}
        validationSchema={EditCompetitionComponent.validationSchema}
    >
        {({isSubmitting}): JSX.Element => <Form className="px-4 py-3">
            <EditCompetitionComponent.input
                name="name"
                type="text"
                label="Submission Title"
                placeholder="Submission Title"
            ><span className="material-icons">sort</span></EditCompetitionComponent.input>
            <EditCompetitionComponent.input
                name="shortDesc"
                type="text"
                label="Short Description"
                placeholder="Short Description"
            ><span className="material-icons">description</span></EditCompetitionComponent.input>
            {this._datePicker()}
            {this._markdownButtons()}
            <div className="form-group">{

                /**
                 * If edit mode, show markdown editor
                 * Otherwise, show the preview
                 */
                this.state.mode === "edit"
                    ? <Editor
                        value={this.state.desc}
                        onValueChange={(code: string): void => this.setState({desc: code})}
                        highlight={(code): string => highlight(code, languages.markdown, "markdown")}
                        className="form-control bg-lighter"
                        padding={3}
                    />
                    : this._markdownPreview()

            }</div>
            <EditCompetitionComponent.otherFields/>
            <button
                className="btn btn-success"
                type="submit"
                disabled={isSubmitting}
            >Submit</button>
        </Form>}
    </Formik>

    public render = (): JSX.Element => (
        this._didSetData
            ? this.content()
            : <Spinner color="primary" size="25vw" className="my-5" centered/>
    )

}
