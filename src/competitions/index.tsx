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
import type {Competition} from "../competition"
import DatePlus from "@luke-zhang-04/dateplus"
import React from "react"
import dateUtils from "../date-utils"
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

export default class Competitions extends React.Component<{}, State> {

    public constructor (props: {}) {
        super(props)

        this.state = {
            competitions: [],
        }
    }

    public componentDidMount = async (): Promise<void> => {
        try {
            const data = await (await fetch(`${url}/competitions/get`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )).json()

            if (!isCompetition(data)) {
                alert("Server response did not match the pre-determined data structure.")
                console.error(`${data} is not of type Competition`)

                return
            }

            this.setState({competitions: data})
        } catch (err: unknown) {
            alert(`An error occured :( ${err}`)
            console.error(err)
        }
    }

    private _getSortedComponents = (): Competition[][][] => {
        const future: Competition[] = this.state.competitions.filter((val) => (
            new Date(val.deadline).getTime() >= dateUtils.getUtcTime()
        )),
            past: Competition[] = this.state.competitions.filter((val) => (
                new Date(val.deadline).getTime() < dateUtils.getUtcTime()
            ))

        return [arrayToChunks(future), arrayToChunks(past)]
    }

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
                        <a href={`/competition?id=${comp.id}`} className="btn btn-outline-primary">More</a>
                    </div>
                </div>
            </div>
        </div>
    }

    private _competitions = (): JSX.Element => {
        const competitions = this._getSortedComponents()

        return <>
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
