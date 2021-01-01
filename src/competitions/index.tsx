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
import type {Competition} from "../competition/baseComponent"
import DatePlus from "@luke-zhang-04/dateplus"
import {Link} from "react-router-dom"
import React from "react"
import UserContext from "../userContext"
import dateUtils from "../date-utils"
import notify from "../notify"
import {url} from "../globals"

type UnknownArray = {[key: string]: unknown}[]

const isCompetition = (
    obj: unknown,
): obj is Competition[] => (
    obj instanceof Array &&
    typeof (obj as UnknownArray)[0]?.id === "number" &&
    typeof (obj as UnknownArray)[0]?.deadline === "string" &&
    typeof (obj as UnknownArray)[0]?.coverImageURL === "string"
)

interface State {
    competitions: Competition[],
}

interface Props {
    user?: CognitoUser,
}

/**
 * Splits an array into chunks
 * @param arr - array to split
 * @param chunkSize - size of array chunks
 */
const arrayToChunks = <T extends any>(arr: T[], chunkSize = 3): T[][] => {
    const chunks: T[][] = []

    for (let index = 0; index < arr.length; index += chunkSize) {
        chunks.push(arr.slice(index, index + chunkSize))
    }

    return chunks
}

class CompetitionsComponent extends React.Component<Props, State> {

    public constructor (props: {}) {
        super(props)

        this.state = {
            competitions: [],
        }
    }

    public componentDidMount = async (): Promise<void> => {
        try {
            // Get a competition
            const data = await (await fetch(`${url}/competitions/get`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )).json()

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

    /**
     * Sort competitions into "chunks"
     */
    private _getSortedComponents = (): Competition[][][] => {

        // Competitions due in the future and past
        const future: Competition[] = this.state.competitions.filter((val) => (
            new Date(val.deadline).getTime() >= dateUtils.getUtcTime()
        )),
            past: Competition[] = this.state.competitions.filter((val) => (
                new Date(val.deadline).getTime() < dateUtils.getUtcTime()
            ))

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
                <img src={comp.coverImageURL} alt="cover"/>
                <div className="comp-info">
                    <div className="deadline">
                        {`${deadline.getWordMonth()} ${deadline.getDate()}, ${deadline.getFullYear()}`}
                    </div>
                    <div className="container comp-details">
                        <h1>{comp.name ?? `${comp.orgName}'s Competition`}</h1>
                        <p className="text-primary">{comp.shortDesc}</p>
                        <Link
                            to={`/competition?id=${comp.id}`}
                            className="btn btn-outline-primary"
                        >More</Link>
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
                    ? <this._newCompetition/>
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

    public render = (): JSX.Element => <div className="container">
        {this._competitions()}
    </div>

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
