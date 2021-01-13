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
import type {Competition} from "../competition/baseComponent"
import DatePlus from "@luke-zhang-04/dateplus"
import DefaultPhoto from "../images/default.svg"
import {Img} from "../elements"
import {Link} from "react-router-dom"
import React from "react"
import Spinner from "../bootstrap/spinner"
import UserContext from "../userContext"
import {arrayToChunks} from "../utils"
import cache from "../cache"
import dateUtils from "../date-utils"
import notify from "../notify"
import {url} from "../globals"

type UnknownArray = {[key: string]: unknown}[]

const isCompetition = (
    obj: unknown,
): obj is Competition[] => (
    obj instanceof Array &&
    (
        obj.length === 0 ||
        typeof (obj as UnknownArray)[0]?.id === "number" &&
        typeof (obj as UnknownArray)[0]?.deadline === "string" &&
        (
            (obj as UnknownArray)[0]?.coverImageURL === undefined ||
            typeof (obj as UnknownArray)[0]?.coverImageURL === "string"
        )
    )
)

interface State {
    competitions?: Competition[],
}

interface Props {
    user?: CognitoUser,
}

class CompetitionsComponent extends React.Component<Props, State> {

    public constructor (props: {}) {
        super(props)

        this.state = {
            competitions: undefined,
        }
    }

    public componentDidMount = async (): Promise<void> => {
        try {
            this._handleCache()

            // Get a competition
            const data = await (await fetch(`${url}/competitions/get`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )).json() as {[key: string]: unknown} 

            if (!isCompetition(data)) { // Check the fetched data
                notify({
                    title: "Error",
                    icon: "report_problem",
                    iconClassName: "text-danger",
                    content: `Data from server did not match the pre-determined structure`,
                })
                console.error(`${data} is not of type Competition`)

                return
            }

            this.setState({competitions: data})

            cache.write(
                "talentmakerCache_competitions",
                data.map((competition) => ({
                    ...competition,
                    desc: undefined, // Remove descriptions; They're long and aren't used in this context
                })),
            )
        } catch (err: unknown) {
            notify({
                title: "Error",
                icon: "report_problem",
                iconClassName: "text-danger",
                content: `${err}`,
            })

            console.error(err)
        }
    }

    public componentDidUpdate = async (): Promise<void> => {
        (await import("../bootstrap/tooltip")).initTooltips()
    }

    private _handleCache = async (): Promise<void> => {
        const data = await cache.read("talentmakerCache_competitions")

        if (isCompetition(data)) { // Check the fetched data
            this.setState({competitions: data})
        }
    }

    /**
     * Sort competitions into "chunks"
     */
    private _getSortedComponents = (): Competition[][][] => {

        // Competitions due in the future and past
        const future: Competition[] = this.state.competitions?.filter((val) => (
            new Date(val.deadline).getTime() >= dateUtils.getUtcTime()
        )) ?? [],
            past: Competition[] = this.state.competitions?.filter((val) => (
                new Date(val.deadline).getTime() < dateUtils.getUtcTime()
            )) ?? []

        return [arrayToChunks(future), arrayToChunks(past)]
    }

    /**
     * A single competition column
     * @param comp - competition details
     * @param index - index of competition (for the key prop)
     */
    private _competition = (comp: Competition, index: number): JSX.Element => {
        const deadline = new DatePlus(comp.deadline)

        return <div key={`comp-col-${index}-${comp.id}`} className="col-lg-4 my-3">
            <div className="comp-card">
                <Img src={comp.coverImageURL ?? DefaultPhoto} alt="cover">
                    <Spinner color="primary" size="6rem" centered/>
                </Img>
                <div className="comp-info">
                    <div className="deadline">
                        {`${deadline.getWordMonth()} ${deadline.getDate()}, ${deadline.getFullYear()}`}
                    </div>
                    <div className="container comp-details">
                        <h1>{comp.name ?? `${comp.orgName}'s Competition`}</h1>
                        <p className="text-primary">{comp.shortDesc}</p>
                        <Link
                            to={`/competition/${comp.id}`}
                            className="btn btn-outline-primary"
                        >Details</Link>
                        { // This competition belongs to this organization
                            this.props.user?.sub === comp.orgId
                                ? <Link
                                    to={`/editCompetition/${comp.id}`}
                                    className="btn btn-outline-dark d-inline-block float-right"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="left"
                                    title="Edit"
                                ><span className="material-icons">create</span></Link>
                                : undefined
                        }
                    </div>
                </div>
            </div>
        </div>
    }

    /**
     * Renders interface for creating new competitions
     */
    private _newCompetition = (): JSX.Element => <>
        <h1>Create a Competition</h1>
        <p>As an organization, you can create a new competition</p>
        <Link
            to="/editCompetition/new"
            className="btn btn-outline-primary"
        >New Competition</Link>
    </>

    /**
     * Renders competitions
     */
    private _competitions = (): JSX.Element => {
        const competitions = this._getSortedComponents()

        return <>
            {
                this.props.user?.isOrg === true
                    ? this._newCompetition()
                    : undefined
            }

            <h1>Upcoming Competitions</h1>
            {competitions[0].map((row, index) => <div key={`comp-row-${index}`} className="row">
                {row.map((comp) => this._competition(comp, index))}
            </div>)}

            <h1>Past Competitions</h1>
            {competitions[1]?.map((row, index) => <div key={`comp-row-${index}`} className="row">
                {row.map((comp) => this._competition(comp, index))}
            </div>)}
        </>
    }

    public render = (): JSX.Element => (
        this.state.competitions
            ? <div className="container">
                {this._competitions()}
            </div>
            : <Spinner color="primary" size="25vw" className="my-5" centered/>
    )

}

/**
 * Wrapper for the competitions component that passes in the user
 */
export const Competitions: React.FC<{}> = () => <UserContext.Consumer>
    {({currentUser: user}): JSX.Element => <CompetitionsComponent
        user={user ?? undefined}
    />}
</UserContext.Consumer>

export default Competitions
