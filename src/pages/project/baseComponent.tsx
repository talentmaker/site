/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import "./index.scss"
import Prism from "prismjs"
import type {Project} from "../../schemas/project"
import React from "react"
import UserContext from "../../contexts/userContext"
import initTooltips from "../../components/bootstrap/tooltip"
import projectAdapter from "../../adapters/project"
import {scrollToHeader} from "../../components/markdown/scrollToHeader"

type Props = {
    /**
     * Project id
     */
    id?: string

    /**
     * Competition id
     */
    compId?: string
}

type State = {
    project?: Project
    hasUser: boolean
    videoDidLoad: boolean
}

export default class BaseComponent extends React.Component<Props, State> {
    public constructor(props: Props, context: React.ContextType<typeof UserContext>) {
        super(props)

        this.user = context.currentUser ?? undefined

        this.state = {
            hasUser: this.user !== undefined,
            videoDidLoad: false,
        }
    }

    public componentDidMount = async (): Promise<void> => {
        if (this.props.id) {
            const project = await projectAdapter(this.user, this.props.id)

            if (!(project instanceof Error)) {
                this.setState({project})
            }

            Prism.highlightAll()

            if (window.location.hash) {
                scrollToHeader(window.location.hash)
            }
        }
    }

    public componentDidUpdate = (): void => {
        Prism.highlightAll()

        if (this.state.hasUser === (this.user === undefined)) {
            this.setState({hasUser: this.user !== undefined})
            this.componentDidMount()
        }

        initTooltips()
    }

    public readonly user?: User

    public static contextType = UserContext

    context!: React.ContextType<typeof UserContext>
}
