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
import "./index.scss"
import type {CognitoUser} from "../cognito-utils"
import Prism from "prismjs"
import React from "react"
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
    coverImageURL: string,
    orgName: string,
    topics: string[],
    shortDesc: string,
    inComp: boolean,
}

const isCompetition = (
    obj: {[key: string]: unknown},
): obj is Competition => (
    typeof obj.id === "number" &&
    typeof obj.deadline === "string" &&
    typeof obj.coverImageURL === "string"
)

type State = {
    competition?: Competition,
    hasuser: boolean,
}

export default abstract class BaseComponent
    extends React.Component<Props, State> {

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
    }

}
