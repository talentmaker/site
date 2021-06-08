/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

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
                <Link
                    className="btn btn-outline-dark me-2 mb-2"
                    to={`/editProject?${qs.stringify({competition: id})}`}
                >
                    <span className="material-icons">create</span> Edit Submission
                </Link>
                <Link
                    className="btn btn-outline-primary me-2"
                    to={`/project?${qs.stringify({competition: id})}`}
                >
                    <span className="material-icons">visibility</span> View Submission
                </Link>
            </div>
        )
    } else if (inComp) {
        return (
            <Link
                className="btn btn-outline-primary mx-2"
                to={`/editProject?${qs.stringify({competition: id, id: "new"})}`}
            >
                <span className="material-icons">add</span> Create Submission
            </Link>
        )
    }

    return <></>
}

type JoinButtonProps = {competition: Competition; user?: User; onSuccess?: () => void}

export const JoinButton: React.FC<JoinButtonProps> = ({competition, user, onSuccess}) => {
    const [isJoining, setJoining] = React.useState(false)

    if (
        user?.isOrg && // User is organization
        competition // Competition exists
    ) {
        return user.sub === competition.orgId ? ( // Organization owns competition
            <Link to={`/editCompetition/${competition.id}`} className="btn btn-outline-dark me-3">
                <span className="material-icons">create</span> Edit
            </Link>
        ) : (
            <></>
        )
    } else if (!competition) {
        return <></>
    }

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

    // User is not an organization
    return competition?.inComp ? (
        <></>
    ) : (
        <button
            className="btn btn-outline-primary btn-lg me-3"
            onClick={join}
            disabled={isJoining}
        >
            {isJoining ? <Spinner inline> </Spinner> : undefined}
            Join
        </button>
    )
}
