/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

import {Button, Container} from "react-bootstrap"
import {Link, useHistory} from "react-router-dom"
import {NotificationContext, UserContext} from "~/contexts"
import {inviteLinkDataAdapter, joinTeamAdapter} from "~/adapters/teams"
import type {InviteLink} from "~/schemas/inviteLink"
import React from "react"
import {Spinner} from "~/components/bootstrap"

type Props = {
    data: string
    integrity: string
}

export const JoinTeam: React.FC<Props> = ({data, integrity}) => {
    const [inviteLinkData, setInviteLinkData] = React.useState<InviteLink>()
    const [isJoining, setIsJoining] = React.useState(false)
    const {currentUser: user} = React.useContext(UserContext)
    const {addNotification: notify} = React.useContext(NotificationContext)
    const history = useHistory()

    React.useEffect(() => {
        ;(async () => {
            const result = await inviteLinkDataAdapter(data)

            if (!(result instanceof Error)) {
                setInviteLinkData(result)
            }
        })()
    }, [])

    const joinTeam = React.useCallback(async () => {
        if (user && inviteLinkData) {
            setIsJoining(true)

            const err = await joinTeamAdapter(user, data, integrity)

            if (!(err instanceof Error)) {
                notify({
                    title: "Successfully Joined Team!",
                    content: `Success! You can now edit the project ${inviteLinkData.projectName}.`,
                    icon: "done",
                    iconClassName: "text-success",
                })
                history.push(`/project/${inviteLinkData.projectId}`)
            }

            setIsJoining(false)
        }
    }, [
        user,
        data,
        integrity,
        inviteLinkData,
        inviteLinkData?.projectName,
        inviteLinkData?.projectId,
    ])

    if (!user) {
        return <p>Error: unauthenticated</p>
    } else if (!inviteLinkData) {
        return <Spinner color="primary" size="25vw" className="my-5" centered />
    }

    return (
        <Container fluid className="py-5" style={{height: "65vh"}}>
            <h1>Join Team</h1>
            <ul>
                <li>
                    Project name:{" "}
                    <Link to={`/project/${inviteLinkData.projectId}`}>
                        <code>{inviteLinkData.projectName}</code>
                    </Link>
                </li>
                <li>
                    Project creator: <code>{inviteLinkData.projectCreator}</code>
                </li>
                <li>
                    Competition name:{" "}
                    <Link to={`/competition/${inviteLinkData.competitionId}`}>
                        <code>{inviteLinkData.competitionName}</code>
                    </Link>
                </li>
                <li>
                    Competition creator: <code>{inviteLinkData.competitionCreator}</code>
                </li>
            </ul>
            <p>
                Are you sure you would like to join the team for{" "}
                <code>{inviteLinkData.projectName}</code> for the competition{" "}
                <code>{inviteLinkData.competitionName}</code>?
            </p>
            <Button variant="success" onClick={joinTeam} className="me-3">
                {isJoining ? <Spinner inline> </Spinner> : undefined}
                Yes
            </Button>
            <Button variant="outline-danger" to="/" as={Link} disabled={isJoining}>
                No
            </Button>
        </Container>
    )
}

export default JoinTeam
