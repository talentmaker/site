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
import cache from "../cache"
import {handleError} from "../errorHandler"
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
    competitionId: string,
    topics?: string[],
    projectId: number,
    name: string,
    creatorUsername: string,
    competitionName: string,
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

type State = {
    project?: Project,
    hasuser: boolean,
    videodidLoad: boolean,
}

export default class BaseComponent extends React.Component<Props, State> {

    public constructor (props: Props) {
        super(props)

        this.state = {
            hasuser: props.user !== undefined,
            videodidLoad: false,
        }
    }

    public componentDidMount = async (): Promise<void> => {
        try {
            this._handleCache()

            let queryString

            if (this.props.id) {
                queryString = `?id=${this.props.id}`
            } else if (this.props.compId && this.props.user) {
                queryString = `?sub=${this.props.user.sub}&competitionId=${this.props.compId}`
            } else {
                throw new Error("No ID's were specified")
            }

            const data = await (await fetch(
                `${url}/projects/getOne${queryString}`,
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

                throw new Error(`The data ${Object.entries(data)} is not the correct structure.`)
            }

            this.setState({project: data})

            cache.write(`talentmakerCache_project-${this.props.id}`, data)
        } catch (err) {
            handleError(err)
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

    private _handleCache = async (): Promise<void> => {
        const data = await cache.read(
            `talentmakerCache_project-${this.props.id}`,
        ) as {[key: string]: unknown}

        if (isProject(data)) {
            this.setState({project: data})
        }
    }

}
