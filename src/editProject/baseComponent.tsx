/**
 * Talentmaker website
 *
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 */

import * as yup from "yup"
import {Field, useField} from "formik"
import type {CognitoUser} from "../cognito-utils"
import React from "react"

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
    id: string,

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
                    className={`form-control bg-darker text-light ${errorClass ?? ""}`}
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

    protected static validationSchema = yup.object({
        name: yup.string()
            .required("Title is required") // eslint-disable-next-line
            .max(64),
        srcURL: yup.string().url(),
        demoURL: yup.string().url(),
        license: yup.string(),
        videoURL: yup.string().url(),
    })

}
