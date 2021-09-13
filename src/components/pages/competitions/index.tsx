/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as adapters from "~/adapters"
import {Button, Container, Row} from "react-bootstrap"
import {
    BulkCompetitionType as CompetitionType,
    Competitions as CompetitionsType,
    competitionsSchema,
} from "~/schemas/competitions"
import {Spinner, initTooltips} from "~/components/bootstrap"
import {getUtcTime, readCache} from "~/utils"
import DatePlus from "@luke-zhang-04/dateplus"
import GridItem from "~/components/gridItem"
import {Link} from "react-router-dom"
import React from "react"
import UserContext from "~/contexts/userContext"
import {arrayToChunks} from "@luke-zhang-04/utils"
import {useAdapter} from "~/hooks"

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
                user?.uid === comp.organizationId ? (
                    <Button
                        as={Link}
                        to={`/editCompetition/${comp.id}`}
                        variant="outline-dark"
                        className="d-inline-block float-end"
                        data-bs-toggle="tooltip"
                        data-bs-placement="left"
                        title="Edit"
                    >
                        <span className="material-icons">create</span>
                    </Button>
                ) : undefined
            }
        </GridItem>
    )
}

export const Competitions: React.FC = () => {
    const {isDone, data} = useAdapter(
        () => adapters.competition.getMany(),
        async () => competitionsSchema.validate(await readCache("talentmakerCache_competitions")),
    )
    const {currentUser: user} = React.useContext(UserContext)

    React.useEffect(() => {
        initTooltips()
    })

    const getSortedCompetitions = React.useCallback(
        (_competitions: CompetitionType[] | undefined): CompetitionsType[][] => {
            if (_competitions === undefined) {
                return []
            }

            // Competitions due in the future and past
            const future: CompetitionsType = _competitions.filter(
                (val) => new Date(val.deadline).getTime() >= getUtcTime(),
            )
            const past: CompetitionsType = _competitions.filter(
                (val) => new Date(val.deadline).getTime() < getUtcTime(),
            )

            return [arrayToChunks(future), arrayToChunks(past)]
        },
        [],
    )

    const sortedCompetitions = getSortedCompetitions(data)

    if (isDone) {
        return (
            <Container fluid className="mt-3">
                {user?.isOrganization === true && (
                    <>
                        <h1>Create a Competition</h1>
                        <p>As an organization, you can create a new competition</p>
                        <Button to="/editCompetition/new" as={Link} variant="outline-primary">
                            New Competition
                        </Button>
                    </>
                )}

                <h1 className="my-3">Upcoming Competitions</h1>
                {sortedCompetitions[0].map((row, index) => (
                    <Row key={`comp-row-0-${index}`} className="g-3">
                        {row.map((comp, index2) => (
                            <Competition
                                key={`comp-item-0-${index}-${index2}`}
                                comp={comp}
                                user={user}
                            />
                        ))}
                    </Row>
                ))}

                <h1 className="mb-3">Past Competitions</h1>
                {sortedCompetitions[1]?.map((row, index) => (
                    <Row key={`comp-row-1-${index}`} className="g-3">
                        {row.map((comp, index2) => (
                            <Competition
                                key={`comp-item-1-${index}-${index2}`}
                                comp={comp}
                                user={user}
                            />
                        ))}
                    </Row>
                ))}
            </Container>
        )
    }

    return <Spinner color="primary" size="25vw" className="my-5" centered />
}

export default Competitions
