/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {Competitions as CompetitionsType, competitionsSchema} from "../../../schemas/competitions"
import {arrayToChunks, getUtcTime, validate} from "../../../utils"
import type {Competition as CompetitionType} from "../../../schemas/competition"
import DatePlus from "@luke-zhang-04/dateplus"
import GridItem from "../../gridItem"
import {Link} from "react-router-dom"
import React from "react"
import Spinner from "../../bootstrap/spinner"
import UserContext from "../../../contexts/userContext"
import cache from "../../../utils/cache"
import competitionsAdapter from "../../../adapters/competitions"

const Competition: React.FC<{comp: CompetitionType; user?: User}> = ({comp, user}) => {
    const deadline = new DatePlus(comp.deadline)

    return (
        <GridItem
            imageURL={comp.coverImageURL ?? undefined}
            tag={`${deadline.getWordMonth()} ${deadline.getDate()}, ${deadline.getFullYear()}`}
            title={comp.name ?? `${comp.orgName}'s Competition`}
            desc={comp.shortDesc}
            link={{to: `/competition/${comp.id}`, text: "Details"}}
        >
            {
                // This competition belongs to this organization
                user?.sub === comp.orgId ? (
                    <Link
                        to={`/editCompetition/${comp.id}`}
                        className="btn btn-outline-dark d-inline-block float-end"
                        data-bs-toggle="tooltip"
                        data-bs-placement="left"
                        title="Edit"
                    >
                        <span className="material-icons">create</span>
                    </Link>
                ) : undefined
            }
        </GridItem>
    )
}

export const Competitions: React.FC = () => {
    const [competitions, setCompetitions] = React.useState<CompetitionsType | undefined>()
    const {currentUser: user} = React.useContext(UserContext)

    React.useEffect(() => {
        ;(async () => {
            const data = await cache.read("talentmakerCache_competitions")

            setCompetitions(await validate(competitionsSchema, data, false))
        })()
        ;(async () => {
            const data = await competitionsAdapter()

            if (!(data instanceof Error)) {
                setCompetitions(data)
            }
        })()
    }, [])

    const getSortedCompetitions = React.useCallback((): CompetitionsType[][] => {
        // Competitions due in the future and past
        const future: CompetitionsType =
            competitions?.filter((val) => new Date(val.deadline).getTime() >= getUtcTime()) ?? []
        const past: CompetitionsType =
            competitions?.filter((val) => new Date(val.deadline).getTime() < getUtcTime()) ?? []

        return [arrayToChunks(future), arrayToChunks(past)]
    }, [competitions])

    if (competitions) {
        const sortedCompetitions = getSortedCompetitions()

        return (
            <div className="container-fluid">
                {user?.isOrg === true ? (
                    <>
                        <h1>Create a Competition</h1>
                        <p>As an organization, you can create a new competition</p>
                        <Link to="/editCompetition/new" className="btn btn-outline-primary">
                            New Competition
                        </Link>
                    </>
                ) : undefined}

                <h1 className="my-3">Upcoming Competitions</h1>
                {sortedCompetitions[0].map((row, index) => (
                    <div key={`comp-row-0-${index}`} className="row g-3">
                        {row.map((comp, index2) => (
                            <Competition
                                key={`comp-item-0-${index}-${index2}`}
                                comp={comp}
                                user={user}
                            />
                        ))}
                    </div>
                ))}

                <h1 className="mb-3">Past Competitions</h1>
                {sortedCompetitions[1]?.map((row, index) => (
                    <div key={`comp-row-1-${index}`} className="row g-3">
                        {row.map((comp, index2) => (
                            <Competition
                                key={`comp-item-1-${index}-${index2}`}
                                comp={comp}
                                user={user}
                            />
                        ))}
                    </div>
                ))}
            </div>
        )
    }

    return <Spinner color="primary" size="25vw" className="my-5" centered />
}

export default Competitions
