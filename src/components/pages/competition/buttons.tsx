/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang
 * https://Luke-zhang-04.github.io
 */

import * as adapters from "~/adapters"
import {Button} from "react-bootstrap"
import {Competition} from "~/schemas/competition"
import {Link} from "react-router-dom"
import {NewProjectModal} from "~/components/newProjectModal"
import React from "react"
import {Spinner} from "~/components/bootstrap"
import qs from "query-string"

export const SubmissionButton: React.FC<{competition: Competition}> = ({competition}) => {
    const {id, hasProject, inComp: isInComp} = competition
    const [shouldShowModal, setShouldShowModal] = React.useState(false)

    const modal = shouldShowModal ? (
        <NewProjectModal
            competition={competition}
            onClose={() => setShouldShowModal(false)}
            shouldShow={shouldShowModal}
        />
    ) : null

    if (hasProject) {
        return (
            <>
                {modal}
                <Button
                    variant="outline-primary"
                    as={Link}
                    className="me-2"
                    to={`/project?${qs.stringify({competition: id})}`}
                >
                    <span className="material-icons">visibility</span> View Submission
                </Button>
            </>
        )
    } else if (isInComp) {
        return (
            <>
                {modal}
                <Button
                    variant="outline-primary"
                    className="mx-2"
                    onClick={() => setShouldShowModal(true)}
                >
                    <span className="material-icons">add</span> Create New Submission
                </Button>
            </>
        )
    }

    return modal
}

type JoinButtonProps = {competition: Competition; user?: User; onSuccess?: () => void}

export const JoinButton: React.FC<JoinButtonProps> = ({competition, user, onSuccess}) => {
    const [isJoining, setJoining] = React.useState(false)
    const join = React.useCallback(async (): Promise<void> => {
        setJoining(true)

        if (user !== undefined && user !== null) {
            const isSuccessful = !(
                (await adapters.competition.join(user, Number(competition.id))) instanceof Error
            )

            if (isSuccessful) {
                onSuccess?.()
            }
        }

        setJoining(false)
    }, [user, competition])

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
