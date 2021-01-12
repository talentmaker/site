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
import initTooltips from "../bootstrap/tooltip"
import notify from "../notify"
import {url} from "../globals"

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

export type Competition = {
    id: number,
    name: string | null,
    desc: string | null,
    videoURL: string | null,
    deadline: string,
    website: string | null,
    email: string,
    orgId: string,
    coverImageURL: string | null,
    orgName: string,
    topics: string[],
    shortDesc: string,
    inComp: boolean,
    hasProject: boolean,
}

export const isCompetition = (
    obj: {[key: string]: unknown},
): obj is Competition => (
    typeof obj?.id === "number" &&
    typeof obj.deadline === "string"
)

type State = {
    competition?: Competition,
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
        this._handleCache()

        const userQS = this.props.user
            ? `&idToken=${this.props.user.idToken}&idTokenChecksum=${this.props.user.idTokenChecksum}`
            : ""

        try {
            const data = await (await fetch(
                `${url}/competitions/getOne?id=${this.props.id}${userQS}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )).json() as {[key: string]: unknown}

            if (!isCompetition(data)) {
                notify({
                    title: "Error",
                    icon: "report_problem",
                    iconClassName: "text-danger",
                    content: "The data from the server did not match",
                })

                console.error(`The data ${Object.entries(data)} is not the correct structure.`)

                return
            }

            this.setState({competition: data})
            cache.write(
                `talentmakerCache_competition-${this.props.id}`,
                data,
            )
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

    private _handleCache = async (): Promise<void> => {
        const data = await cache.read(
            `talentmakerCache_competition-${this.props.id}`,
        ) as {[key: string]: unknown}

        if (isCompetition(data)) {
            this.setState({competition: data})
        }
    }

}
