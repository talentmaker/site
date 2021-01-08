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

import "./index.scss"
import type {CognitoUser} from "../cognito-utils"
import Prism from "prismjs"
import React from "react"
import initTooltips from "../bootstrap/tooltip"
import notify from "../notify"
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
    topics?: string[],
    projectId: number,
    name: string,
}

export const isProject = (obj: {[key: string]: unknown}): obj is Project => (
    typeof obj?.id === "number" &&
    typeof obj.creator === "string" &&
    typeof obj.competitionId === "number" &&
    typeof obj.name === "string"
)

type Props = {

    /**
     * Project id
     */
    id: string,

    /**
     * Current user
     */
    user?: CognitoUser,
}

type State = {
    project?: Project,
    hasuser: boolean,
}

export default class BaseComponent extends React.Component<Props, State> {

    public constructor (props: Props) {
        super(props)

        this.state = {
            hasuser: props.user !== undefined,
        }
    }

    public componentDidMount = async (): Promise<void> => {
        const userQS = this.props.user
            ? `&idToken=${this.props.user.idToken}&idTokenChecksum=${this.props.user.idTokenChecksum}`
            : ""

        try {
            const data = await (await fetch(
                `${url}/projects/getOne?id=${this.props.id}${userQS}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )).json() as {[key: string]: unknown}

            if (!isProject(data)) {
                notify({
                    title: "Error",
                    icon: "report_problem",
                    iconClassName: "text-danger",
                    content: "The data from the server did not match",
                })

                console.error(`The data ${Object.entries(data)} is not the correct structure.`)

                return
            }

            this.setState({project: data})
        } catch (err) {
            notify({
                title: "Error",
                icon: "report_problem",
                iconClassName: "text-danger",
                content: `${err}`,
            })

            console.error(err)
        }

        Prism.highlightAll()
    }

    public componentDidUpdate = (): void => {
        Prism.highlightAll()

        if (this.state.hasuser === (this.props.user === undefined)) {
            this.setState({hasuser: this.props.user !== undefined})
            this.componentDidMount()
        }

        initTooltips()
    }

}
