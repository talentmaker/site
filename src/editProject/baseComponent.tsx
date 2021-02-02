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
import {Field, useField} from "formik"
import type {CognitoUser} from "../utils/cognito"
import React from "react"
import handleError from "../errorHandler"
import {hash} from "../utils/crypto"
import {url} from "../globals"

export type Project = {
    id: number,
    creator: string,
    createdAt: Date,
    desc?: string,
    srcURL?: string,
    demoURL?: string,
    license?: string,
    videoURL?: string,
    coverImageURL?: string,
    competitionId: number,
    name: string,
}

export const isProject = (obj: {[key: string]: unknown}): obj is Project => (
    typeof obj?.id === "number" &&
    typeof obj.creator === "string" &&
    typeof obj.competitionId === "number" &&
    typeof obj.name === "string"
)

export interface Props {

    /**
     * Project id
     */
    id?: string,

    /**
     * Competition id
     */
    compId?: string,

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
     * Already entered project data if it exists
     */
    project?: Project,
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
    srcURL?: string,
    demoURL?: string,
    license?: string,
    videoURL?: string,
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
     * - srcURL
     * - demoURL
     * - license
     * - videoURL
     */
    protected static otherFields = (): JSX.Element => <>
        <BaseComponent.input
            name="srcURL"
            type="url"
            label="Source Code URL"
            placeholder="Source Code URL"
        ><span className="material-icons">code</span></BaseComponent.input>
        <BaseComponent.input
            name="demoURL"
            type="url"
            label="Demo URL"
            placeholder="Demo URL"
        ><span className="material-icons">preview</span></BaseComponent.input>
        <BaseComponent.input
            name="license"
            type="text"
            label="License"
            placeholder="SPDX License ID or URL to a custom license"
        ><span className="material-icons">gavel</span></BaseComponent.input>
        <BaseComponent.input
            name="videoURL"
            type="url"
            label="Video URL"
            placeholder="Video URL"
        ><span className="material-icons">video_library</span></BaseComponent.input>
    </>

    public constructor (props: Props) {
        super(props)

        this.state = {
            desc: `# My Submission\n\nThis is Markdown. You can find out how to use markdown [here](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)`,
            mode: "edit",
        }
    }

    public componentDidMount = async (): Promise<void> => {
        const {user} = this.props

        if (user) {
            const queryString = this.props.id
                ? `?id=${this.props.id}`
                : `?sub=${user.sub}&competitionId=${this.props.compId}`

            try {
                const response = await fetch(
                    `${url}/projects/getOne${queryString}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                )

                if (response.status === 404) {
                    this.didSetData = true

                    this.setState({})
                }

                const data = await (response).json() as {[key: string]: unknown}

                if (isProject(data)) { // Set project ot state
                    this.didSetData = true

                    this.setState({project: data})

                    if (data.desc) { // Update description
                        this.setState({desc: data.desc})
                    }

                    this.initialDataHash = await hash("SHA-256", {
                        ...this.initialValues(),
                        desc: this.state.desc,
                    })
                }
            } catch (err: unknown) {
                handleError(err)
            }
        } else {
            handleError({
                name: "Unauthenticated error",
                message: "User is not authenticated",
            })
        }
    }

    public componentDidUpdate = (): void => {
        if (!this.hasUser && this.props.user) {
            this.componentDidMount()

            this.hasUser = true
        }
    }


    protected initialValues = (): FormValues => {
        const {project} = this.state

        return {
            name: project?.name ?? `${this.props.user?.username ?? ""}'s Submission`,
            srcURL: project?.srcURL ?? "",
            demoURL: project?.demoURL ?? "",
            license: project?.license ?? "",
            videoURL: project?.videoURL ?? "",
        }
    }

    protected static validationSchema = yup.object({
        name: yup.string()
            .required("Title is required") // eslint-disable-next-line
            .max(64),
        srcURL: yup.string()
            .url()
            .max(256),
        demoURL: yup.string()
            .url()
            .max(256),
        license: yup.string()
            .max(256),
        videoURL: yup.string()
            .url()
            .matches(/youtu\.be|youtube/u, "Video must be a YouTube Link")
            .max(256),
    })

    protected hasUser = this.props.user !== undefined

    protected didSetData = this.props.compId === undefined || false

    protected initialDataHash: string | undefined

}
