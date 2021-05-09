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
import {Competitions, competitionsSchema} from "../../schemas/competitions"
import {arrayToChunks, validate} from "../../utils"
import type {Competition} from "../../schemas/competition"
import DatePlus from "@luke-zhang-04/dateplus"
import DefaultPhoto from "../../images/default.svg"
import {Img} from "../../components/elements"
import {Link} from "react-router-dom"
import React from "react"
import Spinner from "../../components/bootstrap/spinner"
import UserContext from "../../contexts/userContext"
import cache from "../../utils/cache"
import competitionsAdapter from "../../adapters/competitions"
import dateUtils from "../../utils/date"

interface State {
    competitions?: Competitions
}

interface Props {
    user?: User
}

class CompetitionsComponent extends React.Component<Props, State> {
    public constructor(props: {}, context: React.ContextType<typeof UserContext>) {
        super(props)

        this.user = context.currentUser ?? undefined

        this.state = {
            competitions: undefined,
        }
    }

    public componentDidMount = async (): Promise<void> => {
        this._handleCache()

        const data = await competitionsAdapter()

        if (!(data instanceof Error)) {
            this.setState({competitions: data})
        }
    }

    public componentDidUpdate = (): void => {
        import("../../components/bootstrap/tooltip").then((mod) => mod.initTooltips())
    }

    public readonly user?: User

    public static contextType = UserContext

    context!: React.ContextType<typeof UserContext>

    private _handleCache = async (): Promise<void> => {
        const data = await cache.read("talentmakerCache_competitions")

        this.setState({competitions: await validate(competitionsSchema, data, false)})
    }

    /**
     * Sort competitions into "chunks"
     */
    private _getSortedComponents = (): Competitions[][] => {
        // Competitions due in the future and past
        const future: Competitions =
            this.state.competitions?.filter(
                (val) => new Date(val.deadline).getTime() >= dateUtils.getUtcTime(),
            ) ?? []
        const past: Competitions =
            this.state.competitions?.filter(
                (val) => new Date(val.deadline).getTime() < dateUtils.getUtcTime(),
            ) ?? []

        return [arrayToChunks(future), arrayToChunks(past)]
    }

    /**
     * A single competition column
     *
     * @param comp - Competition details
     * @param index - Index of competition (for the key prop)
     */
    private _competition = (comp: Competition, index: number): JSX.Element => {
        const deadline = new DatePlus(comp.deadline)

        return (
            <div key={`comp-col-${index}-${comp.id}`} className="col-lg-4 my-3">
                <div className="comp-card">
                    <Img src={comp.coverImageURL ?? DefaultPhoto} alt="cover">
                        <Spinner color="primary" size="6rem" centered />
                    </Img>
                    <div className="comp-info">
                        <div className="deadline">
                            {`${deadline.getWordMonth()} ${deadline.getDate()}, ${deadline.getFullYear()}`}
                        </div>
                        <div className="container-fluid comp-details">
                            <h3>{comp.name ?? `${comp.orgName}'s Competition`}</h3>
                            <p className="text-primary">{comp.shortDesc}</p>
                            <Link
                                to={`/competition/${comp.id}`}
                                className="btn btn-outline-primary"
                            >
                                Details
                            </Link>
                            {
                                // This competition belongs to this organization
                                this.props.user?.sub === comp.orgId ? (
                                    <Link
                                        to={`/editCompetition/${comp.id}`}
                                        className="btn btn-outline-dark d-inline-block float-right"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="left"
                                        title="Edit"
                                    >
                                        <span className="material-icons">create</span>
                                    </Link>
                                ) : undefined
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    /**
     * Renders interface for creating new competitions
     */
    private _newCompetition = (): JSX.Element => (
        <>
            <h1>Create a Competition</h1>
            <p>As an organization, you can create a new competition</p>
            <Link to="/editCompetition/new" className="btn btn-outline-primary">
                New Competition
            </Link>
        </>
    )

    /**
     * Renders competitions
     */
    private _competitions = (): JSX.Element => {
        const competitions = this._getSortedComponents()

        return (
            <>
                {this.props.user?.isOrg === true ? this._newCompetition() : undefined}

                <h1 className="my-3">Upcoming Competitions</h1>
                {competitions[0].map((row, index) => (
                    <div key={`comp-row-${index}`} className="row g-3">
                        {row.map((comp) => this._competition(comp, index))}
                    </div>
                ))}

                <h1 className="mb-3">Past Competitions</h1>
                {competitions[1]?.map((row, index) => (
                    <div key={`comp-row-${index}`} className="row g-3">
                        {row.map((comp) => this._competition(comp, index))}
                    </div>
                ))}
            </>
        )
    }

    public render = (): JSX.Element =>
        this.state.competitions ? (
            <div className="container-fluid">{this._competitions()}</div>
        ) : (
            <Spinner color="primary" size="25vw" className="my-5" centered />
        )
}

export default CompetitionsComponent
