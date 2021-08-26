/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {Button} from "react-bootstrap"
import {Competition} from "~/schemas/competition"
import {Link} from "react-router-dom"
import React from "react"
import {Spinner} from "~/components/bootstrap"
import {competitionJoinAdapter} from "~/adapters/competition"
import qs from "query-string"

export const SubmissionButton: React.FC<{competition: Competition}> = ({
    competition: {id, hasProject, inComp},
}) => {
    if (hasProject) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-end">
                <Button
                    variant="outline-dark"
                    as={Link}
                    className="me-2 mb-2"
                    to={`/editProject?${qs.stringify({competition: id})}`}
                >
                    <span className="material-icons">create</span> Edit Submission
                </Button>
                <Button
                    variant="outline-primary"
                    as={Link}
                    className="me-2"
                    to={`/project?${qs.stringify({competition: id})}`}
                >
                    <span className="material-icons">visibility</span> View Submission
                </Button>
            </div>
        )
    } else if (inComp) {
        return (
            <Button
                variant="outline-primary"
                as={Link}
                className="mx-2"
                to={`/editProject/new?${qs.stringify({competition: id})}`}
            >
                <span className="material-icons">add</span> Create Submission
            </Button>
        )
    }

    return <></>
}

type JoinButtonProps = {competition: Competition; user?: User; onSuccess?: () => void}

export const JoinButton: React.FC<JoinButtonProps> = ({competition, user, onSuccess}) => {
    const [isJoining, setJoining] = React.useState(false)
    const join = React.useCallback(async (): Promise<void> => {
        setJoining(true)

        if (user !== undefined && user !== null) {
            const isSuccessful = !(
                (await competitionJoinAdapter(user, Number(competition.id))) instanceof Error
            )

            if (isSuccessful) {
                onSuccess?.()
            }
        }

        setJoining(false)
    }, [user, competition])

    if (
        user?.isOrg && // User is organization
        competition // Competition exists
    ) {
        return user.uid === competition.organizationId ? ( // Organization owns competition
            <Button
                as={Link}
                variant="outline-dark"
                to={`/editCompetition/${competition.id}`}
                className="me-3"
            >
                <span className="material-icons">create</span> Edit
            </Button>
        ) : null
    } else if (!competition) {
        return null
    }

    // User is not an organization
    return competition?.inComp ? null : (
        <Button
            size="lg"
            variant="outline-primary"
            className="me-3"
            onClick={join}
            disabled={isJoining}
        >
            {isJoining ? <Spinner inline> </Spinner> : undefined}
            Join
        </Button>
    )
}
