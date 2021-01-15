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

import * as yup from "yup"
import {Competition, isCompetition} from "../competition/baseComponent"
import {Field, useField} from "formik"
import type {CognitoUser} from "../utils/cognito"
import React from "react"
import handleError from "../errorHandler"
import {hash} from "../utils/crypto"
import notify from "../notify"
import {url} from "../globals"

export interface Props {

    /**
     * Competition id
     */
    id?: number,

    /**
     * Current user
     */
    user?: CognitoUser,
}

export interface State {

    /**
     * Markdown Description
     */
    desc: string,

    /**
     * Markdown editor state
     */
    mode: "preview" | "edit",

    /**
     * Already entered competition data if it exists
     */
    competition?: Competition,

    /**
     * Deadline
     */
    deadline: Date,
}

export interface FormProps {
    label: string,
    name: string,
    type: string,
    placeholder?: string,
    children?: JSX.Element,
}

export interface FormValues {
    name?: string,
    shortDesc: string,
    videoURL?: string,
    website?: string,
    coverImageURL?: string,
}

export default class BaseComponent extends React.Component<Props, State> {

    /**
     * Input field component
     * @param props - props for form
     */
    protected static input = (props: FormProps): JSX.Element => {
        const [field, meta] = useField<FormProps>(props),
            errorText = meta.error && meta.touched ? meta.error : ""

        let errorClass: string | undefined,
            feedback: JSX.Element | undefined

        if (errorText) {
            errorClass = "is-invalid"
            feedback = <div className="invalid-feedback">
                {errorText}
            </div>
        } else if (meta.touched) {
            errorClass = "is-valid"
            feedback = <></>
        }

        return (
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">{props.children ?? ""}</span>
                </div>
                <Field
                    type={props.type}
                    {...field}
                    placeholder={props.placeholder || props.label}
                    className={`form-control bg-lighter text-dark ${errorClass ?? ""}`}
                />
                {feedback}
            </div>
        )
    }

    /**
     * Fields for:
     * - name
     * - shortDesc
     */
    protected static topFields = (): JSX.Element => <>
        <BaseComponent.input
            name="name"
            type="text"
            label="Submission Title"
            placeholder="Submission Title"
        ><span className="material-icons">sort</span></BaseComponent.input>
        <BaseComponent.input
            name="shortDesc"
            type="text"
            label="Short Description"
            placeholder="Short Description"
        ><span className="material-icons">description</span></BaseComponent.input>
    </>

    /**
     * Fields for:
     * - videoURL
     * - website
     * - coverImageURL
     */
    protected static otherFields = (): JSX.Element => <>
        <BaseComponent.input
            name="videoURL"
            type="url"
            label="Video URL"
            placeholder="Video URL"
        ><span className="material-icons">video_library</span></BaseComponent.input>
        <BaseComponent.input
            name="website"
            type="url"
            label="Website URL"
            placeholder="Website URL"
        ><span className="material-icons">language</span></BaseComponent.input>
        <BaseComponent.input
            name="coverImageURL"
            type="url"
            label="Cover Image URL"
            placeholder="Cover Image URL"
        ><span className="material-icons">insert_photo</span></BaseComponent.input>
    </>

    public constructor (props: Props) {
        super(props)

        this.state = {
            desc: `# New Competition\n\nThis is Markdown. You can find out how to use markdown [here](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)`,
            mode: "edit",
            deadline: new Date(),
        }
    }

    public componentDidMount = async (): Promise<void> => {
        const {user, id: compId} = this.props

        if (!user) {
            return handleError({
                name: "Not authorized",
                message: "User is not authorized to modify this. You may be logged out.",
            })
        } else if (compId) {
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
                    this.didSetData = true
                    this.setState({
                        competition: data,
                        deadline: new Date(data.deadline),
                    })

                    if (data.desc) { // Update description
                        this.setState({desc: data.desc})
                    }

                    this.initialDataHash = await hash("SHA-256", {
                        ...this.initialValues(),
                        desc: this.state.desc,
                    })
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
        }
    }

    public componentDidUpdate = (): void => {
        if (!this.hasUser && this.props.user) {
            this.componentDidMount()

            this.hasUser = true
        }
    }

    protected initialValues = (): FormValues => {
        const {competition} = this.state

        return {
            name: competition?.name ?? "",
            shortDesc: competition?.shortDesc ?? "",
            videoURL: competition?.videoURL ?? "",
            website: competition?.website ?? "",
            coverImageURL: competition?.coverImageURL ?? "",
        }
    }

    protected static validationSchema = yup.object({
        name: yup.string()
            .max(64),
        shortDesc: yup.string()
            .required("Short description is required")
            .max(128),
        videoURL: yup.string()
            .url()
            .matches(/youtu\.be|youtube/u, "Video must be a YouTube Link")
            .max(256),
        website: yup.string()
            .url()
            .max(256),
        coverImageURL: yup.string()
            .url()
            .max(256),
    })

    protected didSetData = this.props.id === undefined || false

    protected hasUser = this.props.user !== undefined

    protected initialDataHash: string | undefined

}
