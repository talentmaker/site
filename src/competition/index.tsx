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
import {
    BlockQuote,
    CodeBlock,
    Table,
    TableCell,
    purifyMarkdown,
} from "../markdown"
import DatePlus from "@luke-zhang-04/dateplus"
import Prism from "prismjs"
import React from "react"
import ReactMarkdown from "react-markdown"
import gfm from "remark-gfm" // Github Flavoured Markdown
import queryString from "query-string"
import {url} from "../globals"

type Props = {
    id: string,
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
}

class CompetitionComponent extends React.Component<Props, State> {

    public constructor (props: Props) {
        super(props)

        this.state = {}
    }

    public componentDidMount = async (): Promise<void> => {
        try {
            const data = await (await fetch(
                `${url}/competitions/getOne?id=${this.props.id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )).json() as {[key: string]: unknown}

            if (!isCompetition(data)) {
                alert("The data from the server did not match")

                console.error(`The data ${Object.entries(data)} is not the correct structure.`)

                return
            }

            this.setState({competition: data})
        } catch (err) {

            alert(`An error occured :( ${err}`)
            console.error(err)
        }

        Prism.highlightAll()
    }

    public componentDidUpdate = (): void => {
        Prism.highlightAll()
    }

    private _orgInfo = (): JSX.Element => <div className="row">
        <div className="col-lg-2">
            <div className="px-4 my-3">
                <img src="images/profile.svg" className="pfp" alt="Profile"/>
            </div>
        </div>
        <div className="col-lg-6 d-flex flex-column justify-content-center">
            <p className="username">
                {this.state.competition?.name ?? `${this.state.competition?.orgName || ""}'s Competition`}
            </p>
            <p className="sub text-muted">
                {this.state.competition?.shortDesc || ""}
            </p>
        </div>
        <div className="col-lg-4 d-flex flex-row align-items-center justify-content-end">
            <button className="btn btn-outline-primary btn-lg mr-3">Join</button>
        </div>
    </div>

    private _compInfo = (): JSX.Element => {
        const {competition} = this.state

        if (competition) {
            const deadline = new DatePlus(competition.deadline)

            deadline.setMinutes( // Offset from UTC Time
                deadline.getMinutes() - deadline.getTimezoneOffset(),
            )

            return <div className="col-lg-3 bg-darker">
                <div className="container">
                    <h1>About</h1>
                    <ul className="list-unstyled text-light">
                        <p>
                            <b>Deadline: </b>
                            {deadline.getWordMonth()} {deadline.getDate()}, {deadline.getFullYear()}
                            @{deadline.getHours() < 10 ? `0${deadline.getHours()}` : deadline.getHours()}:{deadline.getMinutes()}
                        </p>
                        <p>
                            <b>Company: </b>
                            {competition.orgName}<span className="text-muted">#{competition.orgId.slice(0, 7)}</span>
                        </p>
                        <p>
                            <b>Company website: </b>{
                                competition.website
                                    ? <a href={competition.website} target="_blank" rel="noopener noreferrer">{
                                        competition.website
                                    }</a>
                                    : "None"
                            }
                        </p>
                        <p>
                            <b>Company email: </b>
                            <a href={`mailto:${competition.email}`} target="_blank" rel="noopener noreferrer">
                                {competition.email}
                            </a>
                        </p>
                    </ul>
                </div>
            </div>
        }

        return <></>
    }

    private _renderDescription = (): JSX.Element => (
        <div className="markdown-container p-3">
            <div className="container py-2 bg-darker">
                <ReactMarkdown
                    plugins={[[gfm]]}
                    renderers={{
                        blockquote: BlockQuote,
                        code: CodeBlock,
                        table: Table,
                        tableCell: TableCell,
                    }}
                    allowDangerousHtml
                >
                    {purifyMarkdown(
                        this.state.competition?.desc ?? "# No description provided",
                    )}
                </ReactMarkdown>
            </div>
        </div>
    )

    private _getSrc = (): string => this.state.competition?.videoURL
        ?.replace("watch?v=", "embed/")
        .replace("https://youtu.be", "https://www.youtube.com/embed") ?? ""

    public render = (): JSX.Element => <>
        <this._orgInfo/>
        <div className="row bg-primary bar">
            <div className="col-sm-12 topics">
                {this.state.competition?.topics.map((topic, index): JSX.Element => (
                    <p
                        className="bg-primary mx-1 my-0 py-1 px-2 d-flex"
                        key={`topic-${topic}-${index}`}
                    >{topic}</p>
                ))}
            </div>
        </div>
        <div className="row">
            <this._compInfo/>
            <div className="col-lg-9">
                {
                    this.state.competition?.videoURL
                        ? <div className="mx-3 mt-3">
                            <div className="video-container">
                                <iframe
                                    title="competition video"
                                    className="video"
                                    src={this._getSrc()}
                                ></iframe>
                            </div>
                        </div>
                        : <></>
                }
                {this._renderDescription()}
            </div>
        </div>
    </>

}

export const Competition = (): JSX.Element => {
    const query = queryString.parse(window.location.search)

    if ("id" in query && typeof query.id === "string") {
        return <CompetitionComponent id={query.id}/>
    }

    return <>
        <h1>Error:</h1>
        <p>No competition ID specified</p>
    </>
}

export default Competition
